
/**
 * Header: (version message) 
 * - https://learnmeabitcoin.com/technical/networking/#version
 
┌─────────────┬──────────────┬───────────────┬───────┬─────────────────────────────────────┐
│ Name        │ Example Data │ Format        │ Size  │ Bytes                               │
├─────────────┼──────────────┼───────────────┼───────┼─────────────────────────────────────┤
│ Magic Bytes │              │ bytes         │     4 │ F9 BE B4 D9                         │
│ Command     │ "version"    │ ascii bytes   │    12 │ 76 65 72 73 69 6F 6E 00 00 00 00 00 │
│ Size        │ 85           │ little-endian │     4 │ 55 00 00 00                         │
│ Checksum    │              │ bytes         │     4 │ F7 63 9C 60                         │
└─────────────┴──────────────┴───────────────┴───────┴─────────────────────────────────────┘
 */


