const { copyHtml, getEntries, extraJsEntries, watchScss } = require('./utils')
const rollup = require('rollup')
const { conf } = require('./rollup.config')
const { ossServer, server } = require('./server-func')

const { activityNames = '' } = process.env
const arr = activityNames.split(',').map(s => s.trim())

copyHtml()

const entries = getEntries()
const entry = entries.filter(e => arr.includes(e.activityName))
const watchOption = {
  chokidar: true,
  include: 'src/**',
}

const pro = []

pro.push(Promise
  .all((entry.length > 0 ? [...entry, ...extraJsEntries] : [...entries, ...extraJsEntries])
    .map(ent => {
      const config = conf(ent)
      return { entry: ent, watcher: rollup.watch({ ...config, ...watchOption }) }
    }))
  .then((watchers) => {
    watchers.map(({ entry, watcher }) => {
      watcher.on('event', (ev) => {
        if (ev.code === 'START') {
          console.log(`>> ${entry.name} changed, rebuilding`)
        } else if (ev.code === 'END') {
          console.log(`>> js: ${entry.name} built`)
        } else if (ev.code === 'ERROR') {
          console.error(`Error: ${ev.error}`)
        } else if (ev.code === 'FATAL') {
          console.log(`Irreparable error: ${ev.error}`)
        }
      })
    })
  })
  .then(() => {
    console.log('>> vue was in watch')
  })
  .catch(console.error))

const cssEntries = getEntries('../src/css', /\.scss$/, 'css')
const cssEntry = cssEntries.filter(e => arr.includes(e.activityName))

pro.push(Promise
  .all((cssEntry.length > 0 ? [...cssEntry] : cssEntries)
    .map(ent => watchScss(ent)))
  .then(() => {
    console.log('>> scss was in watch')
  }))

Promise.all(pro).then(() => {
  console.log('\n\r')
  ossServer()
  server()
})
