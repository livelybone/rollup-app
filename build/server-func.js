/* eslint-disable semi,no-param-reassign */
const axios = require('axios')
const Koa = require('koa')
const serve = require('koa-static')
const fs = require('fs')
const parse = require('parse5')
const config = require('../config/config')
const { resolve } = require('./utils')

const { port = 3000, expireTime = 3000, NODE_ENV } = process.env
const cache = {}

function getHtml() {
  return fs.readFileSync(resolve(NODE_ENV === 'production' ? '../dist/index.html' : '../views/index.dev.html'), { encoding: 'utf8' })
    .replace(/{{ossUrl}}/g, config.ossUrl)
}

function needGet(host) {
  const cacheItem = cache[host]

  // if cache not exist or expired -> do query;
  if (!cacheItem || cacheItem.expire < Date.now()) return { needGet: true }

  // else use cache;
  const { replacedHtml } = cacheItem
  return { needGet: false, replacedHtml }
}

function find(html, tag = 'body') {
  const nodes = []
  if (html.childNodes) {
    html.childNodes.forEach((node) => {
      if (node.nodeName === tag) {
        nodes.push(node)
      }
      if (node.childNodes && node.childNodes.length > 0) {
        nodes.push(...find(node, tag))
      }
    })
  }
  return nodes
}

function render(host) {
  if (host.startsWith('localhost')) {
    return ''
  }
  const query = needGet(host)
  console.log('get', host)
  return query.needGet ? axios.get(`${config.localhost}/site`, { headers: { host } }).then((res) => {
    const result = res.data.result || {}

    const state = `<script type="text/javascript">window.INIT_STATE=${JSON.stringify({ siteInfo: result })}</script>`
    const document = parse.parse(getHtml())
    const head = find(document, 'head')[0]
    const body = find(document, 'body')[0]
    const breakLines = find(document, '#text').filter(node => /^\s+$/.test(node.value))
    breakLines.forEach((item) => {
      item.value = '\n'
    })
    head.childNodes.unshift(find(parse.parse(state), 'script')[0], breakLines[0])

    const pushInBody = (script, async = true) => {
      if (script) {
        const str = script.startsWith('http')
          ? `<script type="text/javascript" src="${script}" ${async ? 'async' : ''}></script>`
          : `<script type="text/javascript">${script}</script>`
        body.childNodes.push(find(parse.parse(str), 'script')[0], breakLines[0])
      }
    }

    pushInBody(result.service_js)
    pushInBody(result.tongji_js)

    const h = parse.serialize(document)

    // update cache
    cache[host] = {
      siteInfo: result,
      replacedHtml: h,
      expire: Date.now() + +expireTime,
    }
    return h
  }) : Promise.resolve(query.replacedHtml)
}

module.exports = {
  server() {
    const app = new Koa()
    app.use(async (ctx) => {
      const { req: { headers: { host } }, response } = ctx
      response.type = 'text/html'
      response.body = await render(host)
    })

    app.listen(port)
    console.log('---- Your application is running here: http://yourIp:%s, such as http://127.0.0.1:%s', port, port)
  },
  ossServer() {
    const ossPort = +port + 1
    const app = new Koa()

    app.use(serve(resolve('../dist')))

    app.listen(ossPort)
    console.log('---- Oss server for dev started, listen to %s', ossPort)
  }
}
