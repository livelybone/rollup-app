/* For build */
const { uglify } = require('rollup-plugin-uglify')
const { resolve } = require('./utils')

const baseConf = require('./rollup.config.base')

module.exports = {
  conf: entry => Object.assign({}, baseConf, {
    input: entry.filename,
    output: {
      file: resolve(`../dist/${entry.distName}`),
      format: 'iife',
      name: entry.moduleName || 'Activity',
      globals: {
        axios: 'axios',
        'src/common/Mixin': 'Mixin',
      },
    },
    external: entry.moduleName ? ['axios'] : ['src/common/Mixin'],
    plugins: (entry.moduleName ? [...baseConf.plugins.slice(0, 2), baseConf.plugins[3]] : baseConf.plugins).concat([uglify()]),
  })
}