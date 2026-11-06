import { encodeNetstrings, decodeNetstrings } from '@lp-labs/netstring-codec';
if (decodeNetstrings(encodeNetstrings([new Uint8Array([42])]))[0]?.[0] !== 42)
  throw new Error('Frame');
// @ts-expect-error invalid argument must be rejected by declarations
encodeNetstrings(['data']);
