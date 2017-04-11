/**
 * Flips an alphabet into a character lookup table.
 */
function makeCodes (chars) {
  const out = {}
  for (let i = 0; i < chars.length; ++i) {
    out[chars.charAt(i)] = i
  }
  return out
}

function gcd (a, b) {
  return b === 0 ? a : gcd(b, a % b)
}

export function parse (string, encoding, opts = {}) {
  if (encoding.codes == null) {
    encoding.codes = makeCodes(encoding.chars)
  }

  // Count the padding bytes:
  let end = string.length
  while (string.charAt(end - 1) === '=') {
    --end
  }

  // Allocate the output:
  const constructor = opts.out != null ? opts.out : Array
  const out = new constructor(end * encoding.bits / 8 | 0)

  // Parse the data:
  let bits = 0 // Number of bits currently in the buffer
  let buffer = 0 // Bits waiting to be written out, MSB first
  let written = 0 // Next byte to write
  for (let i = 0; i < end; ++i) {
    // Read one character from the string:
    const value = encoding.codes[string.charAt(i)]
    if (value === void 0) {
      throw new SyntaxError('Invalid character ' + string.charAt(i))
    }

    // Append the bits to the buffer:
    bits += encoding.bits
    buffer = buffer << encoding.bits | value

    // Write out some bits if the buffer has a byte's worth:
    if (bits >= 8) {
      bits -= 8
      out[written++] = 0xff & buffer >> bits
    }
  }

  // Verify that we have received just enough bits:
  const leftover = 0xff & buffer << 8 - bits
  if (bits >= encoding.bits || leftover) {
    throw new SyntaxError('Unexpected end of data')
  }

  // Verify padding:
  if (!opts.loose) {
    const maxPad = 8 * encoding.bits / gcd(8, encoding.bits)
    const padding = (string.length - end) * encoding.bits
    if (padding >= maxPad || padding + bits & 7) {
      throw new SyntaxError('Invalid padding')
    }
  }

  return out
}

export function stringify (data, encoding) {
  let out = ''

  let bits = 0 // Number of bits currently in the buffer
  let buffer = 0 // Bits waiting to be written out, MSB first
  const mask = (1 << encoding.bits) - 1
  for (let i = 0; i < data.length; ++i) {
    // Slurp data into the buffer:
    buffer = buffer << 8 | 0xff & data[i]
    bits += 8

    // Write out as much as we can:
    while (bits > encoding.bits) {
      bits -= encoding.bits
      out += encoding.chars[mask & buffer >> bits]
    }
  }

  // Partial character:
  if (bits) {
    out += encoding.chars[mask & buffer << encoding.bits - bits]
  }

  // Add padding characters until we hit a byte boundary:
  while (out.length * encoding.bits & 7) {
    out += '='
  }

  return out
}
