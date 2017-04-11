import * as codec from './codec.js'

const encoding = {
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
  bits: 5
}

export function parse (string, opts) {
  return codec.parse(string, encoding, opts)
}

export function stringify (data, opts) {
  return codec.stringify(data, encoding, opts)
}
