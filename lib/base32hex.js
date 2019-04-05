import * as codec from './codec.js'

var encoding = {
  chars: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
  bits: 5
}

export function parse (string, opts) {
  return codec.parse(string, encoding, opts)
}

export function stringify (data, opts) {
  return codec.stringify(data, encoding, opts)
}
