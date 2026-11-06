# @lp-labs/netstring-codec

Canonical binary netstring framing and complete-buffer parsing.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/netstring-codec
```

## Working example

```js
import { encodeNetstrings, decodeNetstrings } from '@lp-labs/netstring-codec';
if (decodeNetstrings(encodeNetstrings([new Uint8Array([42])]))[0]?.[0] !== 42)
  throw new Error('Frame');
```

CommonJS: `const api = require('@lp-labs/netstring-codec')`.

## Behavior, customization and limits

encodeNetstrings accepts up to1024 Uint8Array records,total payload<=1048576 bytes; returns length:payload, concatenation. decodeNetstrings accepts complete buffer<=1060000 bytes, rejects leading-zero lengths, missing separators,truncation and record/payload budgets. Empty stream allowed, empty records allowed. Returned bytes are copied. O(total bytes)time/storage; not streaming or text encoding.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export declare function encodeNetstrings(records: readonly Uint8Array[]): Uint8Array;
export declare function decodeNetstrings(input: Uint8Array): Uint8Array[];
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
