import * as codec from './codec.js'

var encoding = {
  chars: '0123456789ABCDEF',
  bits: 4
}

export function parse (string, opts) {
  return codec.parse(string.toUpperCase(), encoding, opts)
}

export function stringify (data, opts) {
  return codec.stringify(data, encoding, opts)
}
