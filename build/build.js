const { compileScss, copyHtml, getEntries, extraJsEntries } = require('./utils')
const rollup = require('rollup')
const { conf } = require('./rollup.config')

const { activityNames = '' } = process.env
const arr = activityNames.split(',').map(s => s.trim())

copyHtml()

const entries = getEntries()
const entry = entries.filter(e => arr.includes(e.activityName))

Promise
  .all((entry.length > 0 ? [...entry, ...extraJsEntries] : [...entries, ...extraJsEntries])
    .map(ent => {
      const config = conf(ent)
      return rollup.rollup(config).then((bundle) => bundle.write(config.output)).then(() => {
        console.log(`>> js: ${ent.name} built`)
      })
    }))
  .then(() => {
    console.log('>> Vue files compiled successful')
  })
  .catch(console.error)

const cssEntries = getEntries('../src/css', /\.scss$/, 'css')
const cssEntry = cssEntries.filter(e => arr.includes(e.activityName))

Promise
  .all((cssEntry.length > 0 ? [...cssEntry] : cssEntries)
    .map(ent => compileScss(ent)))
  .then(() => {
    console.log('>> Scss compiled successful')
  })
