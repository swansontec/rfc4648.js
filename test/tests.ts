/* global describe, it */

import { expect } from 'chai'
import { base16, base32, base32hex, base64, base64url } from '../src/index'

// Test for simple round-trips:
type TestVector = [number[] | string, string]

// Test for encoded string with errors:
type ErrorTestVector =
  | [string, string, number[]] // Strict fails, loose parses
  | [string, string, string] // Both fail differently
  | [string, string] // Both fail the same way

/**
 * Turns an ASCII string into a Uint8Array:
 */
function parseAscii(string: string): Uint8Array {
  const out = new Uint8Array(string.length)
  for (let i = 0; i < string.length; ++i) {
    out[i] = string.charCodeAt(i)
  }
  return out
}

/**
 * Tests the provided codec's round-trip capabilities.
 */
function generateTests(codec: typeof base16, vectors: TestVector[]): void {
  for (const [data, text] of vectors) {
    it(`round-trips "${text}"`, function() {
      const expected =
        typeof data === 'string' ? parseAscii(data) : Uint8Array.from(data)
      expect(codec.stringify(expected)).equals(text)
      expect(codec.parse(text)).deep.equals(expected)
    })
  }
}

/**
 * Tests the provided codec's error-handling capabilities.
 */
function generateErrorTests(
  codec: typeof base16,
  vectors: ErrorTestVector[]
): void {
  for (const [text, error, loose] of vectors) {
    if (loose == null || typeof loose === 'string') {
      it(`rejects "${text}"`, function() {
        const looseMessage = loose == null ? error : loose
        expect(() => codec.parse(text)).throws(error)
        expect(() => codec.parse(text, { loose: true })).throws(looseMessage)
      })
    } else {
      it(`loosely parses "${text}"`, function() {
        const expected = Uint8Array.from(loose)
        expect(() => codec.parse(text)).throws(error)
        expect(codec.parse(text, { loose: true })).deep.equals(expected)
      })
    }
  }
}

describe('base16', function() {
  generateTests(base16, [
    ['', ''],
    ['f', '66'],
    ['fo', '666F'],
    ['foo', '666F6F'],
    ['foob', '666F6F62'],
    ['fooba', '666F6F6261'],
    ['foobar', '666F6F626172'],
    // Full alphabet:
    [[0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef], '0123456789ABCDEF']
  ])

  generateErrorTests(base16, [
    ['0', 'Invalid padding', 'Unexpected end of data'],
    ['0=', 'Unexpected end of data'],
    ['00=', 'Invalid padding', [0x00]]
  ])

  it('decodes lowercase characters', function() {
    const expected = Uint8Array.from([0xab, 0xcd, 0xef])
    expect(base16.parse('abcdef')).deep.equals(expected)
  })

  it('works with plain arrays', function() {
    const expected = [0xab, 0xcd, 0xef]
    expect(base16.parse('abcdef', { out: Array })).deep.equals(expected)
  })
})

describe('base32', function() {
  generateTests(base32, [
    // rfc4648:
    ['', ''],
    ['f', 'MY======'],
    ['fo', 'MZXQ===='],
    ['foo', 'MZXW6==='],
    ['foob', 'MZXW6YQ='],
    ['fooba', 'MZXW6YTB'],
    ['foobar', 'MZXW6YTBOI======'],
    // Full alphabet:
    [
      [0x00, 0x44, 0x32, 0x14, 0xc7, 0x42, 0x54, 0xb6, 0x35, 0xcf],
      'ABCDEFGHIJKLMNOP'
    ],
    [
      [0x84, 0x65, 0x3a, 0x56, 0xd7, 0xc6, 0x75, 0xbe, 0x77, 0xdf],
      'QRSTUVWXYZ234567'
    ]
  ])

  generateErrorTests(base32, [
    // Illegal characters:
    ['A1======', 'Invalid character 1', 'Unexpected end of data'],
    ['A9======', 'Invalid character 9'],
    ['Aa======', 'Invalid character a', [0]],
    ['He1l0===', 'Invalid character e', [57, 22, 183]],
    // Non-byte ending:
    ['A=======', 'Unexpected end of data'],
    ['A7======', 'Unexpected end of data'],
    ['AAA=====', 'Unexpected end of data'],
    ['AAAAAA==', 'Unexpected end of data'],
    // Padding issues:
    ['AA', 'Invalid padding', [0]],
    ['AA==', 'Invalid padding', [0]],
    ['AAAA', 'Invalid padding', [0, 0]],
    ['AAAAA', 'Invalid padding', [0, 0, 0]],
    ['AAAAAAA', 'Invalid padding', [0, 0, 0, 0]],
    ['AAAAAAAA========', 'Invalid padding', [0, 0, 0, 0, 0]]
  ])

  it('Fixes common typos in loose mode', function() {
    expect(base32.parse('He1l0===', { loose: true })).deep.equals(
      base32.parse('HELLO===')
    )
  })
})

describe('base32hex', function() {
  generateTests(base32hex, [
    // rfc4648:
    ['', ''],
    ['f', 'CO======'],
    ['fo', 'CPNG===='],
    ['foo', 'CPNMU==='],
    ['foob', 'CPNMUOG='],
    ['fooba', 'CPNMUOJ1'],
    ['foobar', 'CPNMUOJ1E8======'],
    // Full alphabet:
    [
      [0x00, 0x44, 0x32, 0x14, 0xc7, 0x42, 0x54, 0xb6, 0x35, 0xcf],
      '0123456789ABCDEF'
    ],
    [
      [0x84, 0x65, 0x3a, 0x56, 0xd7, 0xc6, 0x75, 0xbe, 0x77, 0xdf],
      'GHIJKLMNOPQRSTUV'
    ]
  ])
})

describe('base64', function() {
  generateTests(base64, [
    // rfc4648:
    ['', ''],
    ['f', 'Zg=='],
    ['fo', 'Zm8='],
    ['foo', 'Zm9v'],
    ['foob', 'Zm9vYg=='],
    ['fooba', 'Zm9vYmE='],
    ['foobar', 'Zm9vYmFy'],
    // Full alphabet:
    [
      [0x00, 0x10, 0x83, 0x10, 0x51, 0x87, 0x20, 0x92, 0x8b, 0x30, 0xd3, 0x8f],
      'ABCDEFGHIJKLMNOP'
    ],
    [
      [0x41, 0x14, 0x93, 0x51, 0x55, 0x97, 0x61, 0x96, 0x9b, 0x71, 0xd7, 0x9f],
      'QRSTUVWXYZabcdef'
    ],
    [
      [0x82, 0x18, 0xa3, 0x92, 0x59, 0xa7, 0xa2, 0x9a, 0xab, 0xb2, 0xdb, 0xaf],
      'ghijklmnopqrstuv'
    ],
    [
      [0xc3, 0x1c, 0xb3, 0xd3, 0x5d, 0xb7, 0xe3, 0x9e, 0xbb, 0xf3, 0xdf, 0xbf],
      'wxyz0123456789+/'
    ],
    // base64url characters:
    [[0xfb, 0xff], '+/8=']
  ])

  generateErrorTests(base64, [
    // Non-byte ending:
    ['A===', 'Unexpected end of data'],
    ['+/+=', 'Unexpected end of data'],
    ['AAAAA', 'Invalid padding', 'Unexpected end of data'],
    // Padding issues:
    ['AA=', 'Invalid padding', [0]],
    ['AAAA====', 'Invalid padding', [0, 0, 0]]
  ])
})

describe('base64url', function() {
  generateTests(base64url, [[[0xfb, 0xff], '-_8=']])

  it('should work without padding', function() {
    expect(base64url.stringify([0x00], { pad: false })).equals('AA')
  })
})
