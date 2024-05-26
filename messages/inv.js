
const varint = require('varint'); // library to handle encoding and decoding varInts
const { littleEndianToInt } = require(`../utils/helper`);
const logger = require('../utils/logger');
const chalk = require('chalk');


class Inv {
  constructor({ count, inventory } = {}) {
    this.command = 'inv';
    this.count = count; // number of inventory items
    this.inventory = inventory; // inventory items array
  }

  // Parse Inv buffer message 
  // - Returns parsed Inv Object
  static parse(buffer) {
    try {
      // inv
      const invCount = varint.decode(buffer); // Varint lib decodes buffers first byte (varint) to get inventory count
      const varIntSize = varint.decode.bytes; // Number of bytes used by varInt
      
     
      buffer = buffer.slice(varIntSize); // Removes varInt from buffer .slice(varIntSize)
      if (buffer.length < 36) throw new Error('Buffer too short');

      const inventoryArr = []; // Store parsed inventory items

      // loops through each inventory item using invCount
      for (let i = 0; i < invCount; i++) {

        // type 1 = transaction, type 2 = a block
        const type = littleEndianToInt(buffer.slice(0, 4)); // Item type - first 4 bytes
        buffer = buffer.slice(4); // Removes type (first 4 bytes) from buffer - .slice(4)

        const hash = buffer.slice(0, 32).reverse(); // Hash = first 32 bytes of buffer - reverse() 
        buffer = buffer.slice(32); // Remove hash (first 32 bytes) from buffer - .slice(32)
        inventoryArr.push({ type, hash }); // Push item to inventory array
      }

      return new Inv({ count: invCount, inventory: inventoryArr }); // Returns new Inv Object with parsed values

    } catch (err) {
      logger.error(`Error Parsing Inv Message ${chalk.redBright(`${err}`)}`);
      return null;
    }
  }
}



module.exports = Inv;


/**
Payload: (inv message) - https://learnmeabitcoin.com/technical/networking/#inv
┌─────────────┬─────────────────────┬──────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Name        │ Format              │ Size     │ Example Bytes                                                                                                │
├─────────────┼─────────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Count       │ compact size(varint)│ variable │ 01                                                                                                           │
│ Inventory   │ inventory vector    │ variable │ 01 00 00 00 aa 32 5e 91 22 aa 39 ca 18 c7 5a ab e2 a3 ce af 98 02 ac d1 a4 07 20 92 5b fd 77 ff f5 8e d8 21  │
└─────────────┴─────────────────────┴──────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────

 */