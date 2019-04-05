import * as codec from './codec.js'

var encoding = {
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
  bits: 6
}

export function parse (string, opts) {
  return codec.parse(string, encoding, opts)
}

export function stringify (data, opts) {
  return codec.stringify(data, encoding, opts)
}
