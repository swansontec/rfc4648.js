# rfc4648

This library implements encoding and decoding for the data formats specified in [rfc4648](https://tools.ietf.org/html/rfc4648):

* base64
* base64url
* base32
* base32hex
* base16

Each encoding has a simple API inspired by the built-in `JSON` object:

    const base32 = require('rfc4648').base32
    // or import { base32 } from 'rfc4648'

    base32.stringify([57, 22, 183]) // 'HELLO==='
    base32.parse('HELLO===') // [57, 22, 183]

The library has tree-shaking support, so tools like [rollup.js](https://rollupjs.org/) or [Webpack 2](https://webpack.js.org/) can automatically trim away any encodings you don't use.

## API details

The `stringify` methods each take array-like object of bytes and return a string.

The `parse` methods each take a string and return an `Array` of bytes. If you would like a different return type, such as `Uint8Array`, pass its constructor in the second argument:

    base64.parse('AOk=', { out: Uint8Array })

The constructor will be called with `new`, and should accept a single integer for the length.

If you pass the option `{ loose: true }` in the second parameter, the parser will not validate padding characters (`=`):

    base64.parse('AOk', { loose: true }) // No error

To define your own encoding, use the `codec` module:

    const codec = require('rfc4648').codec

    const myEncoding = {
      chars: '01234567',
      bits: 3
    }

    codec.stringify([220, 10], myEncoding) // '670050=='
    codec.parse('670050', myEncoding, { loose: true }) // [ 220, 10 ]

The `encoding` structure should have two members, a `chars` member giving the alphabet and a `bits` member giving the bits per character. The `codec.parse` method will extend this with a third member, `codes`, the first time it's called. The `codes` member is a lookup table mapping from characters back to numbers.
