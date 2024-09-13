
const { logger } = require('../utils/logHandler');
const {  decodeVarInt } = require(`../utils/helper`);

class Inv {
  constructor({ count, inventory } = {}) {
    this.command = 'inv';
    this.count = count; // number of inventory items
    this.inventory = inventory; // inventory items array
  }

  // Parse Inv buffer message 
  static parse(payload) {
    try {
      
      let inventoryArray = [];
      let offset = 0;
      const itemCount = decodeVarInt(payload, offset);
      offset += itemCount.size;

      logger('info', 'Inv.Parse - Inventory Count: ', itemCount.value);
  
      for (let i = 0; i < itemCount.value; i++) {
        // Each inventory item is 36 bytes
        const type = payload.readUInt32LE(offset);
        offset += 4;
        const hash = payload.slice(offset, offset + 32).toString('hex');
        offset += 32;
        
        inventoryArray.push({ type, hash });
      }
    
      return new Inv({ count: itemCount.value, inventory: inventoryArray }); // Returns new Inv Object with parsed values

    } catch (err) {
      logger('error', 'Inv.parse', err);
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