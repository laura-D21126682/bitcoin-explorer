
const crypto = require('crypto');

class Ping {
  constructor({
    nonce = crypto.randomBytes(8)
  } = {}) {
    this.command = 'ping';
    this.nonce = nonce;
  }
  serialise() {
    return this.nonce;
  }

}


module.exports = Ping;


/**
 * Ping Message:
 * - https://learnmeabitcoin.com/technical/networking/#ping
  
 The "ping" message contains a random number as its payload:
Payload: (ping)
┌─────────────┬─────────┬──────┬─────────────────────────┐
│ Name        │ Format  │ Size │ Example Bytes           │
├─────────────┼─────────┼──────┼─────────────────────────┤
│ Nonce       │ bytes   │    8 │ 88 c8 49 39 65 b6 41 69 │
└─────────────┴─────────┴──────┴─────────────────────────┘
 */