'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function parse (string, encoding, opts) {
  if ( opts === void 0 ) opts = {};

  // Build the character lookup table:
  if (!encoding.codes) {
    encoding.codes = {};
    for (var i = 0; i < encoding.chars.length; ++i) {
      encoding.codes[encoding.chars[i]] = i;
    }
  }

  // The string must have a whole number of bytes:
  if (!opts.loose && (string.length * encoding.bits) & 7) {
    throw new SyntaxError('Invalid padding')
  }

  // Count the padding bytes:
  var end = string.length;
  while (string[end - 1] === '=') {
    --end;

    // If we get a whole number of bytes, there is too much padding:
    if (!opts.loose && !(((string.length - end) * encoding.bits) & 7)) {
      throw new SyntaxError('Invalid padding')
    }
  }

  // Allocate the output:
  var out = new (opts.out || Uint8Array)((end * encoding.bits / 8) | 0);

  // Parse the data:
  var bits = 0; // Number of bits currently in the buffer
  var buffer = 0; // Bits waiting to be written out, MSB first
  var written = 0; // Next byte to write
  for (var i$1 = 0; i$1 < end; ++i$1) {
    // Read one character from the string:
    var value = encoding.codes[string[i$1]];
    if (value === void 0) {
      throw new SyntaxError('Invalid character ' + string[i$1])
    }

    // Append the bits to the buffer:
    buffer = (buffer << encoding.bits) | value;
    bits += encoding.bits;

    // Write out some bits if the buffer has a byte's worth:
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 0xff & (buffer >> bits);
    }
  }

  // Verify that we have received just enough bits:
  if (bits >= encoding.bits || 0xff & (buffer << (8 - bits))) {
    throw new SyntaxError('Unexpected end of data')
  }

  return out
}

function stringify (data, encoding, opts) {
  if ( opts === void 0 ) opts = {};

  var mask = (1 << encoding.bits) - 1;
  var out = '';

  var bits = 0; // Number of bits currently in the buffer
  var buffer = 0; // Bits waiting to be written out, MSB first
  for (var i = 0; i < data.length; ++i) {
    // Slurp data into the buffer:
    buffer = (buffer << 8) | (0xff & data[i]);
    bits += 8;

    // Write out as much as we can:
    while (bits > encoding.bits) {
      bits -= encoding.bits;
      out += encoding.chars[mask & (buffer >> bits)];
    }
  }

  // Partial character:
  if (bits) {
    out += encoding.chars[mask & (buffer << (encoding.bits - bits))];
  }

  // Add padding characters until we hit a byte boundary:
  if (opts.pad === undefined || opts.pad) {
    while ((out.length * encoding.bits) & 7) {
      out += '=';
    }
  }

  return out
}

var codec = /*#__PURE__*/Object.freeze({
  parse: parse,
  stringify: stringify
});

var encoding = {
  chars: '0123456789ABCDEF',
  bits: 4
};

function parse$1 (string, opts) {
  return parse(string.toUpperCase(), encoding, opts)
}

function stringify$1 (data, opts) {
  return stringify(data, encoding, opts)
}

var base16 = /*#__PURE__*/Object.freeze({
  parse: parse$1,
  stringify: stringify$1
});

var encoding$1 = {
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
  bits: 5
};

function parse$2 (string, opts) {
  if ( opts === void 0 ) opts = {};

  return parse(
    opts.loose
      ? string
        .toUpperCase()
        .replace(/0/g, 'O')
        .replace(/1/g, 'L')
        .replace(/8/g, 'B')
      : string,
    encoding$1,
    opts
  )
}

function stringify$2 (data, opts) {
  return stringify(data, encoding$1, opts)
}

var base32 = /*#__PURE__*/Object.freeze({
  parse: parse$2,
  stringify: stringify$2
});

var encoding$2 = {
  chars: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
  bits: 5
};

function parse$3 (string, opts) {
  return parse(string, encoding$2, opts)
}

function stringify$3 (data, opts) {
  return stringify(data, encoding$2, opts)
}

var base32hex = /*#__PURE__*/Object.freeze({
  parse: parse$3,
  stringify: stringify$3
});

var encoding$3 = {
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  bits: 6
};

function parse$4 (string, opts) {
  return parse(string, encoding$3, opts)
}

function stringify$4 (data, opts) {
  return stringify(data, encoding$3, opts)
}

var base64 = /*#__PURE__*/Object.freeze({
  parse: parse$4,
  stringify: stringify$4
});

var encoding$4 = {
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
  bits: 6
};

function parse$5 (string, opts) {
  return parse(string, encoding$4, opts)
}

function stringify$5 (data, opts) {
  return stringify(data, encoding$4, opts)
}

var base64url = /*#__PURE__*/Object.freeze({
  parse: parse$5,
  stringify: stringify$5
});

exports.base16 = base16;
exports.base32 = base32;
exports.base32hex = base32hex;
exports.base64 = base64;
exports.base64url = base64url;
exports.codec = codec;
