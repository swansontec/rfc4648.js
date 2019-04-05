import { parse, stringify } from './codec.js'

const base16Encoding = {
  chars: '0123456789ABCDEF',
  bits: 4
}

export const base16 = {
  parse(string, opts) {
    return parse(string.toUpperCase(), base16Encoding, opts)
  },

  stringify(data, opts) {
    return stringify(data, base16Encoding, opts)
  }
}

const base32Encoding = {
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
  bits: 5
}

export const base32 = {
  parse(string, opts = {}) {
    return parse(
      opts.loose
        ? string
            .toUpperCase()
            .replace(/0/g, 'O')
            .replace(/1/g, 'L')
            .replace(/8/g, 'B')
        : string,
      base32Encoding,
      opts
    )
  },

  stringify(data, opts) {
    return stringify(data, base32Encoding, opts)
  }
}

const base32HexEncoding = {
  chars: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
  bits: 5
}

export const base32hex = {
  parse(string, opts) {
    return parse(string, base32HexEncoding, opts)
  },

  stringify(data, opts) {
    return stringify(data, base32HexEncoding, opts)
  }
}

const base64Encoding = {
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  bits: 6
}

export const base64 = {
  parse(string, opts) {
    return parse(string, base64Encoding, opts)
  },

  stringify(data, opts) {
    return stringify(data, base64Encoding, opts)
  }
}

const base64UrlEncoding = {
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
  bits: 6
}

export const base64url = {
  parse(string, opts) {
    return parse(string, base64UrlEncoding, opts)
  },

  stringify(data, opts) {
    return stringify(data, base64UrlEncoding, opts)
  }
}

export const codec = { parse, stringify }
