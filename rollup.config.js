import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'
import { uglify } from 'rollup-plugin-uglify'

import packageJson from './package.json'

const babelOpts = {
  babelrc: false,
  presets: [
    [
      '@babel/preset-env',
      {
        exclude: ['transform-regenerator'],
        loose: true
      }
    ]
  ]
}

export default [
  {
    input: 'src/index.js',
    output: [
      { file: packageJson.module, format: 'esm', sourceMap: true },
      { file: packageJson.main, format: 'cjs', sourceMap: true }
    ],
    plugins: [babel(babelOpts)]
  },
  {
    input: 'src/index.js',
    output: { file: 'lib/index.min.js', format: 'iife', name: 'rfc4648' },
    plugins: [babel(babelOpts), uglify(), filesize()]
  }
]
