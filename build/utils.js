const path = require('path')
const fsExtra = require('fs-extra')
const sass = require('node-sass')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const chokidar = require('chokidar')

function resolve(...url) {
  return path.resolve(__dirname, ...url)
}

function compileScss(entry) {
  const from = entry.filename
  const to = resolve(`../dist/${entry.distName}`)
  return new Promise((resolveFn) => {
    sass.render({
      file: from,
      outputStyle: 'compressed',
    }, (err, res) => {
      postcss([autoprefixer])
        .process(res.css, { from, to })
        .then((result) => {
          fsExtra.outputFileSync(to, result.css)
          if (result.map) {
            fsExtra.writeFile(`${to}.map`, result.map, () => true)
          }
          resolveFn()
        })
    })
  })
}

function getScssDependencies(entry) {
  const scss = fsExtra.readFileSync(entry.filename).toString()
  const reg = /@import\s*["'][^"']+["']/g
  const arr = scss.match(reg)
  return arr ? arr.map(str => {
    const path = str.split(/['"]/g)[1]
    if (/\.(scss|css)$/.test(path)) {
      return resolve(entry.filename, '..', path)
    } else {
      return resolve(entry.filename, '..', path.replace(/\.[^./]$/g, '') + '.scss')
    }
  }) : []
}

function watchScss(entry) {
  const url = entry.filename
  const dependencies = getScssDependencies(entry)
  console.log(dependencies)
  const watcher = chokidar.watch([url, ...dependencies])
  const fn = () => {
    compileScss(entry)
    console.log(`>> css: ${entry.name} compiled successful`)
  }
  watcher
    .on('add', fn)
    .on('change', (file) => {
      console.log(`>> css changed: ${file}`)
      fn()
    })
}

function copyHtml() {
  fsExtra.copySync(resolve('../views/index.prod.html'), resolve('../dist/index.html'))
  console.log('>> index.html copy successful')
}

function getEntries(directory = '../src/pages', reg = /\.vue$/, suffix = 'js', activityName = '') {
  const entries = []
  fsExtra.readdirSync(resolve(directory))
    .forEach((filename) => {
      if (filename !== 'component-css') {
        const name = filename.replace(reg, '')
        const activityN = activityName || name
        if (reg.test(filename) && !fsExtra.statSync(resolve(directory, filename)).isDirectory()) {
          entries.push({
            name,
            activityName: activityN,
            filename: resolve(directory, filename), // source filename
            distName: `${directory.replace('../src/', '')}/${name}.${suffix}`, // ends of dest filename
          })
        } else {
          entries.push(...getEntries(`${directory}/${filename}`, reg, suffix, activityN))
        }
      }
    })

  return entries
}

module.exports = {
  resolve,
  compileScss,
  watchScss,
  copyHtml,
  getEntries,
  extraJsEntries: [
    {
      name: 'Mixin',
      filename: resolve('../src/common/Mixin.js'),
      moduleName: 'Mixin',
      distName: 'commonjs/Mixin.js',
    },
  ],
}
