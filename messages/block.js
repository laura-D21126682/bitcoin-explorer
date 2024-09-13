
const { decodeVarInt, hash256 } = require('../utils/helper');
const Transaction = require('../messages/tx');
const { logger } = require('../utils/logHandler');


class Block {
  constructor({ version, prevBlock, merKleRoot, timestamp, bits, nonce, txnCount, txnsArray, blockSize} = {}) {
    this.command = 'block';
    this.version = version; // Block version
    this.prevBlock = prevBlock; // Prev block hash
    this.merKleRoot = merKleRoot; 
    this.timestamp = timestamp; 
    this.bits = bits; // Difficulty target
    this.nonce = nonce; 
    this.txnCount = txnCount;
    this.txnsArray = txnsArray;
    this.hash = null;
    this.difficulty = 0;
    this.blockSize = blockSize;
  }

  serialiseHeader() {

    const headerBuffer = Buffer.alloc(80);

    headerBuffer.writeInt32LE(this.version, 0); // writes 4 byte signed Int at index 0
    Buffer.from(this.prevBlock).reverse().copy(headerBuffer, 4); // writes 32 bytes at position 4
    Buffer.from(this.merKleRoot).reverse().copy(headerBuffer, 36); // writes 32 bytes at position 36
    headerBuffer.writeUInt32LE(this.timestamp, 68);
    Buffer.from(this.bits).copy(headerBuffer, 72);
    Buffer.from(this.nonce).copy(headerBuffer, 76); // 4 bytes -uint32_t - nonce used to generate this block

    return headerBuffer;
  }

  calculateHash() {
    if( this.hash === null ) { // prevent from performing hash more than once
      this.hash = hash256(this.serialiseHeader()).reverse().toString('hex');
    }
     return this.hash;
   }
   

  target() {
    const byte1 = this.bits[0];
    const byte2 = this.bits[1];
    const byte3 = this.bits[2];
     
    const coefficient = (byte3 << 16) | (byte2 << 8) | byte1;
    const exponent = this.bits[3];
    const target = coefficient * Math.pow(256, (exponent - 3));
    return target;
  }

  calculateDifficulty() {
    const maxTarget = 0xffff * Math.pow(256, (0x1d - 3)); // max target = lowest difficulty
    const difficultyLevel = maxTarget / this.target();
    return difficultyLevel;
  }

  calculateBlockSize() {

  }

  static parse(buffer) {
    try{

      const blockSize = buffer.length;

      if (buffer.length < 80) {
        throw new Error(`Buffer less than 80 bytes: ${buffer.length}`);
      }

      const version = buffer.readInt32LE(0);      
      const prevBlock = buffer.slice(4, 36).reverse(); // 32 bytes - char[32] - hash value of the previous block
      const merKleRoot = buffer.slice(36, 68).reverse(); // 32 bytes - char[32] - hash of all transactions related to this block
      const timestamp = buffer.readUInt32LE(68); // uint32_t - Unix timestamp when block was created
      const bits = buffer.slice(72, 76); // 4 bytes - uint32_t	- calculated difficulty target 
      const nonce = buffer.slice(76, 80);
      


      let offset = 80;
      
      const { value: txnCount, size: txnCountSize } = decodeVarInt(buffer, offset);

      
      offset += txnCountSize;
      // console.log('offset: ', offset);

      const txnsArray = [];

      for (let i = 0; i < txnCount; i++) {
        // const txnBuffer = buffer.slice(offset);
        const { tx, newOffset } = Transaction.parse(buffer.slice(offset));

        if (tx === null) {
          throw new Error(`Parsing transactions failed at ${i}`);
        }

        txnsArray.push(tx);
        offset += newOffset;
      }

      // console.log('txnsArray: ', txnsArray);

      const block = new Block({ version, prevBlock, merKleRoot, timestamp, bits, nonce, txnCount, txnsArray, blockSize });
      return block;

    } catch (err) {
      logger('error', 'Block.parse', err);
      return null;
    }
  }

  toJsObject() {
    return {
      command: this.command,
      hash: this.calculateHash(),
      version: this.version,
      prevBlock: Buffer.from(this.prevBlock).toString('hex'),
      merkleroot: Buffer.from(this.merKleRoot).toString('hex'),
      timestamp: new Date(this.timestamp * 1000).toUTCString(),
      bits: this.bits.toString('hex'),
      nonce: this.nonce.toString('hex'),
      transaction_count: this.txnCount,
      transactions: this.txnsArray.map(tx => tx.toJsObject()),
      blockSize: this.blockSize,
      difficulty: this.calculateDifficulty(),
    }
    
  }
}

module.exports = Block;

