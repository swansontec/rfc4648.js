const path = require('path')

module.exports = {
  extends: [
    'standard-kit/lint',
    'standard-kit/lint/typescript'
  ],
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname
  },
  plugins: ['prettier'],
  rules: {
    'no-var': 'error',
    'prettier/prettier': 'error'
  }
}
