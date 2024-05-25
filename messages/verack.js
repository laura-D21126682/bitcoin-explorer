
class Verack {
  constructor() {
    this.command = 'verack';
  }
  serialise() {
    return Buffer.alloc(0); // returns empty payload
  }
}


module.exports = Verack;

/**
 * Verack Message:
 * - https://learnmeabitcoin.com/technical/networking/#version
 *
 The "verack" is a simple message header without a payload:
┌─────────────┬──────────────┬───────────────┬───────┬─────────────────────────────────────┐
│ Name        │ Example Data │ Format        │ Size  │ Example Bytes                       │
├─────────────┼──────────────┼───────────────┼───────┼─────────────────────────────────────┤
│ Magic Bytes │              │ bytes         │     4 │ F9 BE B4 D9                         │
│ Command     │ "verack"     │ ascii bytes   │    12 │ 76 65 72 61 63 6B 00 00 00 00 00 00 │
│ Size        │ 0            │ little-endian │     0 │ 00 00 00 00                         │
│ Checksum    │              │ bytes         │     4 │ 5D F6 E0 E2                         │
└─────────────┴──────────────┴───────────────┴───────┴─────────────────────────────────────┘

Hexadecimal: F9BEB4D976657261636B000000000000000000005DF6E0E2
 */
