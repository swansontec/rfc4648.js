import * as codec from './codec.js'

const encoding = {
  chars: '0123456789ABCDEF',
  bits: 4
}

export function parse (string, opts) {
  return codec.parse(string.toUpperCase(), encoding, opts)
}

export function stringify (data) {
  return codec.stringify(data, encoding)
}
