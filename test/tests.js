/* global describe, it */
const assert = require('assert')
const rfc4648 = require('../lib/index.cjs.js')

const specVectors = [
  ['base64', '', ''],
  ['base64', 'f', 'Zg=='],
  ['base64', 'fo', 'Zm8='],
  ['base64', 'foo', 'Zm9v'],
  ['base64', 'foob', 'Zm9vYg=='],
  ['base64', 'fooba', 'Zm9vYmE='],
  ['base64', 'foobar', 'Zm9vYmFy'],
  ['base32', '', ''],
  ['base32', 'f', 'MY======'],
  ['base32', 'fo', 'MZXQ===='],
  ['base32', 'foo', 'MZXW6==='],
  ['base32', 'foob', 'MZXW6YQ='],
  ['base32', 'fooba', 'MZXW6YTB'],
  ['base32', 'foobar', 'MZXW6YTBOI======'],
  ['base32hex', '', ''],
  ['base32hex', 'f', 'CO======'],
  ['base32hex', 'fo', 'CPNG===='],
  ['base32hex', 'foo', 'CPNMU==='],
  ['base32hex', 'foob', 'CPNMUOG='],
  ['base32hex', 'fooba', 'CPNMUOJ1'],
  ['base32hex', 'foobar', 'CPNMUOJ1E8======'],
  ['base16', '', ''],
  ['base16', 'f', '66'],
  ['base16', 'fo', '666F'],
  ['base16', 'foo', '666F6F'],
  ['base16', 'foob', '666F6F62'],
  ['base16', 'fooba', '666F6F6261'],
  ['base16', 'foobar', '666F6F626172']
]

const dataVectors = [
  [
    'base16',
    [0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef],
    '0123456789ABCDEF'
  ],
  [
    'base32',
    [0x00, 0x44, 0x32, 0x14, 0xc7, 0x42, 0x54, 0xb6, 0x35, 0xcf],
    'ABCDEFGHIJKLMNOP'
  ],
  [
    'base32',
    [0x84, 0x65, 0x3a, 0x56, 0xd7, 0xc6, 0x75, 0xbe, 0x77, 0xdf],
    'QRSTUVWXYZ234567'
  ],
  [
    'base32hex',
    [0x00, 0x44, 0x32, 0x14, 0xc7, 0x42, 0x54, 0xb6, 0x35, 0xcf],
    '0123456789ABCDEF'
  ],
  [
    'base32hex',
    [0x84, 0x65, 0x3a, 0x56, 0xd7, 0xc6, 0x75, 0xbe, 0x77, 0xdf],
    'GHIJKLMNOPQRSTUV'
  ],
  [
    'base64',
    [0x00, 0x10, 0x83, 0x10, 0x51, 0x87, 0x20, 0x92, 0x8b, 0x30, 0xd3, 0x8f],
    'ABCDEFGHIJKLMNOP'
  ],
  [
    'base64',
    [0x41, 0x14, 0x93, 0x51, 0x55, 0x97, 0x61, 0x96, 0x9b, 0x71, 0xd7, 0x9f],
    'QRSTUVWXYZabcdef'
  ],
  [
    'base64',
    [0x82, 0x18, 0xa3, 0x92, 0x59, 0xa7, 0xa2, 0x9a, 0xab, 0xb2, 0xdb, 0xaf],
    'ghijklmnopqrstuv'
  ],
  [
    'base64',
    [0xc3, 0x1c, 0xb3, 0xd3, 0x5d, 0xb7, 0xe3, 0x9e, 0xbb, 0xf3, 0xdf, 0xbf],
    'wxyz0123456789+/'
  ],
  ['base64', [0xfb, 0xff], '+/8='],
  ['base64url', [0xfb, 0xff], '-_8=']
]

const failVectors = [
  ['base16', '0'],
  ['base16', '0='],
  ['base16', '00=', true],
  // Illegal characters:
  ['base32', 'A1======'],
  ['base32', 'Aa======'],
  // Non-byte ending:
  ['base32', 'A======='],
  ['base32', 'A7======'],
  ['base32', 'AAA====='],
  ['base32', 'AAAAAA=='],
  // Padding issues:
  ['base32', 'AA', true],
  ['base32', 'AA==', true],
  ['base32', 'AAAA', true],
  ['base32', 'AAAAA', true],
  ['base32', 'AAAAAAA', true],
  ['base32', 'AAAAAAAA========', true],
  // Non-byte ending:
  ['base64', 'A==='],
  ['base64', '+/+='],
  ['base64', 'AAAAA'],
  // Padding issues:
  ['base64', 'AA=', true],
  ['base64', 'AAAA====', true]
]

function parseAscii (string) {
  const out = []
  for (let i = 0; i < string.length; ++i) {
    out[i] = string.charCodeAt(i)
  }
  return out
}

describe('rfc4648', function () {
  it('should match the official test vectors', function () {
    specVectors.forEach(vector => {
      const [codec, input, string] = vector
      const data = parseAscii(input)

      assert.equal(rfc4648[codec].stringify(data), string)
      assert.deepEqual(rfc4648[codec].parse(string), data)
    })
  })

  it('should match our extra test vectors', function () {
    dataVectors.forEach(vector => {
      const [codec, data, string] = vector

      assert.equal(rfc4648[codec].stringify(data), string)
      assert.deepEqual(rfc4648[codec].parse(string), data)
    })
  })

  it('should fail on invalid input', function () {
    failVectors.forEach(vector => {
      const [codec, string, loose] = vector

      // Strict and loose versions:
      function f1 () {
        rfc4648[codec].parse(string)
      }
      function f2 () {
        rfc4648[codec].parse(string, { loose: true })
      }

      // Verify exceptions:
      assert.throws(f1, string)
      if (loose) {
        assert.doesNotThrow(f2, string)
      } else {
        assert.throws(f2, string)
      }
    })
  })

  it('Should support non-array return types', function () {
    const out = rfc4648.base16.parse('f00d', { out: Uint8Array })
    assert(out instanceof Uint8Array)
  })
})

describe('base16', function () {
  it('should decode lowercase characters', function () {
    assert.deepEqual(rfc4648.base16.parse('abcdef'), [0xab, 0xcd, 0xef])
  })
})
