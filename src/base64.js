import * as codec from './codec.js'

const encoding = {
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  bits: 6
}

export function parse (string, opts) {
  return codec.parse(string, encoding, opts)
}

export function stringify (data) {
  return codec.stringify(data, encoding)
}
