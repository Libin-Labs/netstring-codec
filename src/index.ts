function bytes(v: Uint8Array, max = 1048576): void {
  if (!(v instanceof Uint8Array)) throw new TypeError('Expected Uint8Array');
  if (v.length > max) throw new RangeError('Byte budget exceeded');
}
export function encodeNetstrings(records: readonly Uint8Array[]): Uint8Array {
  if (!Array.isArray(records) || records.length > 1024) throw new RangeError('Record budget');
  let total = 0;
  const chunks: Uint8Array[] = [];
  for (const record of records) {
    bytes(record);
    total += record.length;
    if (total > 1048576) throw new RangeError('Payload budget');
    const head = new TextEncoder().encode(String(record.length) + ':'),
      chunk = new Uint8Array(head.length + record.length + 1);
    chunk.set(head);
    chunk.set(record, head.length);
    chunk[chunk.length - 1] = 44;
    chunks.push(chunk);
  }
  const out = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}
export function decodeNetstrings(input: Uint8Array): Uint8Array[] {
  bytes(input, 1060000);
  const out: Uint8Array[] = [];
  let pos = 0,
    total = 0;
  while (pos < input.length) {
    if (out.length >= 1024) throw new RangeError('Record budget');
    const start = pos;
    let n = 0;
    while (pos < input.length && input[pos]! >= 48 && input[pos]! <= 57) {
      if (pos - start >= 7) throw new RangeError('Length budget');
      n = n * 10 + input[pos]! - 48;
      pos++;
    }
    if (pos === start || input[pos] !== 58 || (pos - start > 1 && input[start] === 48))
      throw new RangeError('Noncanonical length');
    pos++;
    total += n;
    if (total > 1048576 || pos + n >= input.length || input[pos + n] !== 44)
      throw new RangeError('Truncated or invalid payload');
    out.push(input.slice(pos, pos + n));
    pos += n + 1;
  }
  return out;
}
