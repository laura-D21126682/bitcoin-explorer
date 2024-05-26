

const varint = require('varint'); // library to handle encoding and decoding variable length ints (varints)
const { intToLittleEndian } = require(`../utils/helper`);


class GetData {
  constructor({ count, inventory = [] } = {}) {
    this.command = 'getdata';
    this.count = count; // number of inventory items
    this.inventory = inventory; // inventory items array
  }


  // Updates GetData payload with inv data
  loadInvData(inventoryArr) {
    // Push each item from inv inventory array to getData inventory array
    inventoryArr.forEach(item => this.inventory.push({ type: item.type, hash: item.hash }));
    this.count = this.inventory.length; 
  }



  serialise() {
    const countEncoded = Buffer.from(varint.encode(this.count)); // Encode count as varInt
    const inventoryEncoded = this.inventory.map(item => Buffer.concat([
      intToLittleEndian(item.type, 4), // convert inventory type to little endian (4 bytes)
      Buffer.from(item.hash, 'hex').reverse() // Convert inventory hash to buffer and reverse byte order
    ])); 

    return Buffer.concat([ countEncoded, ...inventoryEncoded ]); 
  }

}


module.exports = GetData; 



/**
Payload: (getdata) - https://learnmeabitcoin.com/technical/networking/#getdata

┌─────────────┬───────────────────┬──────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Name        │ Format            │ Size     │ Example Bytes                                                                                                │
├─────────────┼───────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Count       │ compact size      │ variable │ 01                                                                                                           │
│ Inventory   │ inventory vector  │ variable │ 01 00 00 00 aa 32 5e 91 22 aa 39 ca 18 c7 5a ab e2 a3 ce af 98 02 ac d1 a4 07 20 92 5b fd 77 ff f5 8e d8 21  │
└─────────────┴───────────────────┴──────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
 */



