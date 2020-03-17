import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'
import resolve from '@rollup/plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'

import packageJson from './package.json'

const extensions = ['.ts']
const babelOpts = {
  babelrc: false,
  extensions,
  include: ['src/**/*'],
  presets: [
    [
      '@babel/preset-env',
      {
        exclude: ['transform-regenerator'],
        loose: true
      }
    ],
    '@babel/typescript'
  ]
}
const resolveOpts = { extensions }

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: packageJson.module, format: 'esm', sourcemap: true },
      { file: packageJson.main, format: 'cjs', sourcemap: true }
    ],
    plugins: [resolve(resolveOpts), babel(babelOpts)]
  },
  {
    input: 'src/index.ts',
    output: { file: 'lib/index.min.js', format: 'iife', name: 'rfc4648' },
    plugins: [resolve(resolveOpts), babel(babelOpts), uglify(), filesize()]
  }
]
