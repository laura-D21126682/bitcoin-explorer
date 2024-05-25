
require('dotenv').config();
const { hash256, intToLittleEndian } = require('../utils/helper');

const MAGIC_NUMBER = process.env.MAGIC_NUMBER;

class Header {
  constructor({ 
    command, 
    payload, 
  } = {}) {
    this.magic = Buffer.from(MAGIC_NUMBER, 'hex'); // 4 byte magic num 
    
    this.command = Buffer.alloc(12); // Set buffer to 12 bytes
    this.command.write(command, 'ascii'); // writes command in ASCII to command buffer
    
    this.payload = payload; // Payload (e.g. Version message)
    this.payloadLength = payload.length; // Message size

    // Performs double sha245 on payload and takes the first 4 bytes
    this.checksum = hash256(payload).slice(0, 4); 
  }

  serialise() {
    return Buffer.concat([
      this.magic,
      this.command,
      intToLittleEndian(this.payloadLength, 4), // payload length - 4 byte buffer
      this.checksum,
  
    ]);
  }
}



module.exports = Header;



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


