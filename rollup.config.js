import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'
const packageJson = require('./package.json')

const bubleOpts = {
  transforms: {
    dangerousForOf: true
  }
}

export default [
  {
    dest: packageJson['main'],
    entry: 'src/index.js',
    format: 'cjs',
    plugins: [buble(bubleOpts)],
    sourceMap: true
  },
  {
    dest: 'lib/index.min.js',
    entry: 'src/index.js',
    format: 'iife',
    moduleName: 'rfc4648',
    plugins: [buble(bubleOpts), uglify(), filesize()]
  }
]
