import * as codec from './codec.js'

const encoding = {
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
  bits: 5
}

export function parse(string, opts = {}) {
  return codec.parse(
    opts.loose
      ? string
          .toUpperCase()
          .replace(/0/g, 'O')
          .replace(/1/g, 'L')
          .replace(/8/g, 'B')
      : string,
    encoding,
    opts
  )
}

export function stringify(data, opts) {
  return codec.stringify(data, encoding, opts)
}
