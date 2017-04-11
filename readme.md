# rfc4648.js

This library implements encoding and decoding for the data formats specified in [rfc4648](https://tools.ietf.org/html/rfc4648):

* base64
* base64url
* base32
* base32hex
* base16

Each encoding has a simple API inspired by Javascript's built-in `JSON` object:

    const { base32 } = require('rfc4648')
    // or import { base32 } from 'rfc4648'

    base32.parse('HELLO===') // -> [57, 22, 183]
    base32.stringify([57, 22, 183]) // -> 'HELLO==='

The library has tree-shaking support, so tools like [rollup.js](https://rollupjs.org/) or [Webpack 2](https://webpack.js.org/) can automatically trim away any encodings you don't use.

* Zero external dependencies
* 100% test coverage
* 0.9K minified + gzip (full library, no tree shaking)

## API details

The library provides the following top-level modules:

* `base64`
* `base64url`
* `base32`
* `base32hex`
* `base16`
* `codec`

Each module exports a `parse` and `stringify` function.

### const string = baseXX.stringify(data)

Each `stringify` function takes array-like object of bytes and returns a string.

### const data = baseXX.parse(string, opts)

Each `parse` function takes a string and returns an `Array` of bytes. If you would like a different return type, such as `Uint8Array`, pass its constructor in the second argument:

    base64.parse('AOk=', { out: Uint8Array })

The constructor will be called with `new`, and should accept a single integer for the length.

If you pass the option `{ loose: true }` in the second parameter, the parser will not validate padding characters (`=`):

    base64.parse('AOk', { loose: true }) // No error

### Custom encodings

To define your own encodings, use the `codec` module:

    const codec = require('rfc4648').codec

    const myEncoding = {
      chars: '01234567',
      bits: 3
    }

    codec.stringify([220, 10], myEncoding) // '670050=='
    codec.parse('670050', myEncoding, { loose: true }) // [ 220, 10 ]

The `encoding` structure should have two members, a `chars` member giving the alphabet and a `bits` member giving the bits per character. The `codec.parse` function will extend this with a third member, `codes`, the first time it's called. The `codes` member is a lookup table mapping from characters back to numbers.
