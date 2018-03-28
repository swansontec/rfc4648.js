import buble from 'rollup-plugin-buble'
import filesize from 'rollup-plugin-filesize'
import uglify from 'rollup-plugin-uglify'

import packageJson from './package.json'

const bubleOpts = {
  transforms: {
    dangerousForOf: true
  }
}

export default [
  {
    input: 'src/index.js',
    output: {
      file: packageJson['main'],
      format: 'cjs',
      sourceMap: true
    },
    plugins: [buble(bubleOpts)]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'lib/index.min.js',
      format: 'iife',
      name: 'rfc4648'
    },
    plugins: [buble(bubleOpts), uglify(), filesize()]
  }
]
