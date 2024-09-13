
const { logger } = require('../utils/logHandler');
const crypto = require('crypto');

class Pong {
  constructor({
    nonce = crypto.randomBytes(8)
  } = {}) {
    this.command = 'pong';
    this.nonce = nonce;
  }
  serialise() {
    return this.nonce;
  }

}


module.exports = Pong;




/**
 * Pong Message:
 * - https://learnmeabitcoin.com/technical/networking/#pong
  
 The "pong" message response contains a random number as its payload: 
 Payload: (pong)
┌─────────────┬─────────┬──────┬─────────────────────────┐
│ Name        │ Format  │ Size │ Example Bytes           │
├─────────────┼─────────┼──────┼─────────────────────────┤
│ Nonce       │ bytes   │    8 │ 88 c8 49 39 65 b6 41 69 │
└─────────────┴─────────┴──────┴─────────────────────────┘
 */