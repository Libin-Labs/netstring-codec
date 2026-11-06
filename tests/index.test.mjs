import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('wire format', () => {
  assert.equal(
    new TextDecoder().decode(api.encodeNetstrings([new TextEncoder().encode('hi')])),
    '2:hi,',
  );
});
test('empty stream and record', () => {
  assert.deepEqual(api.decodeNetstrings(new Uint8Array()), []);
  assert.deepEqual(api.decodeNetstrings(new TextEncoder().encode('0:,')), [new Uint8Array()]);
});
test('binary payload', () => {
  const v = new Uint8Array([0, 44, 58, 255]);
  assert.deepEqual(api.decodeNetstrings(api.encodeNetstrings([v, v])), [v, v]);
});
test('malformed lengths', () => {
  for (const x of ['01:a,', ':,', '1:a', '1:a.', '9:abc,', '-1:a,'])
    assert.throws(() => api.decodeNetstrings(new TextEncoder().encode(x)));
});
test('copied ownership', () => {
  const wire = api.encodeNetstrings([new Uint8Array([1])]);
  const out = api.decodeNetstrings(wire);
  out[0][0] = 9;
  assert.equal(wire[2], 1);
});
test('types and capacity', () => {
  assert.throws(() => api.encodeNetstrings([[]]));
  assert.throws(() => api.encodeNetstrings(Array(1025).fill(new Uint8Array())));
  assert.throws(() => api.decodeNetstrings([]));
});
