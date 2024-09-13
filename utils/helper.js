
const { logger } = require('../utils/logHandler');
const crypto = require('crypto');
const ip = require('ip');


/**
 * Function to convert int to little endian byte sequence - ensures buffer is specified size
 * - Allocates a buffer of size 'length', initialised with zeroes 
 * - Writes provided int to buffer from position 0(offset) in little endian format
 * - If length 8 bytes, uses bigint to handle larger value
 * - returns buffer of in little endian format
 * @param {*} int - number(int) being converted
 * @param {*} length - amount of bytes in buffer
 */
const intToLittleEndian = (int, length) => {
  const buffer = Buffer.alloc(length); 
  if (length === 8) {
    buffer.writeBigUInt64LE( BigInt(int), 0);
  } else {
    buffer.writeUIntLE(int, 0, length); 
  }
  return buffer;
}

const signedIntToLittleEndian = (int, length) => {
  const buffer = Buffer.alloc(length);
  if (length === 8) {
    buffer.writeBigInt64LE(BigInt(int), 0);
  } else {
    buffer.writeIntLE(int, 0, length);
  } 
  return buffer;
}

/**
 * Function to convert little endian byte sequence  to int
 * @param {*} buffer - number(int) being converted
 */
const littleEndianToInt = (buffer) => {

  let intValue;
  const length = buffer.length;
  
  if (length === 8) {
    intValue = buffer.readBigUInt64LE(0);
  } else if (length <= 6) {
    intValue = BigInt(buffer.readUIntLE(0, length)); 
  } else {
    throw new Error(`LitleEndianToInt: Buffer length not supported for safe integer conversion`)
  }
  return intValue;
}

const signedLittleEndianToInt = (buffer) => {
  console.log('signed little endian to Int functin: Buffer', buffer)
  let intValue;
  const length = buffer.length;

  if (length === 8) {
    intValue = buffer.readBigInt64LE(0);
  } else if ( length <= 6 ) {
    intValue = buffer.readIntLE(0, length);
  } else {
    throw new Error(`SignedLittleEndianToInt: Buffer length not supported for safe integer conversion`);
  }
  return intValue;
}


const bitIntToSafeNumber = (bitIntValue) => {
  const maxSafeInteger = BigInt(Number.MAX_SAFE_INTEGER);
  if(bitIntValue > maxSafeInteger) {
    throw new  Error(`BigInt value exceeds safe integer range`);
  } 
  return Number(bitIntValue);
}


// function decodeVarInt(buffer, offset) {
//   const firstByte = buffer.readUInt8(offset);
//   let value, size;

//   if (firstByte < 0xfd) {
//     value = firstByte;
//     size = 1;
//   } else if (firstByte === 0xfd) {
//     value = buffer.readUInt16LE(offset + 1);
//     size = 3;
//   } else if (firstByte === 0xfe) {
//     value = buffer.readUInt32LE(offset + 1);
//     size = 5;
//   } else {
//     value = buffer.readBigUInt64LE(offset + 1);
//     size = 9;
//   }

//   return { value, size };
// }



// Helper function to read a varint
function decodeVarInt(buffer, offset) {
  const firstByte = buffer.readUInt8(offset);
  // logger.debug(`decodeVarInt -> firstByte: ${firstByte}`);
  if (firstByte < 0xfd) {
    return { value: firstByte, size: 1 };
  } else if (firstByte === 0xfd) {
    const value = buffer.readUInt16LE(offset + 1);
    // logger.debug(`decodeVarInt -> value: ${value}, size: 3`);
    return { value, size: 3 };
  } else if (firstByte === 0xfe) {
    const value = buffer.readUInt32LE(offset + 1);
    // logger.debug(`decodeVarInt -> value: ${value}, size: 5`);
    return { value, size: 5 };
  } else {
    const value = buffer.readBigUInt64LE(offset + 1);
    // logger.debug(`decodeVarInt -> value: ${value}, size: 9`);
    return { value, size: 9 };
  }
}


function encodeVarInt(value) {
  if (value < 0xfd) {
    return Buffer.from([value]);
  } else if (value <= 0xffff) {
    const buffer = Buffer.alloc(3);
    buffer.writeUInt8(0xfd, 0);
    buffer.writeUInt16LE(value, 1);
    return buffer;
  } else if (value <= 0xffffffff) {
    const buffer = Buffer.alloc(5);
    buffer.writeUInt8(0xfe, 0);
    buffer.writeUInt32LE(value, 1);
    return buffer;
  } else {
    const buffer = Buffer.alloc(9);
    buffer.writeUInt8(0xff, 0);
    buffer.writeBigUInt64LE(BigInt(value), 1);
    return buffer;
  }
  }


function bufferToBigIntLE(buffer) {
  const hex = buffer.toString('hex');
  return BigInt(`0x${hex.match(/../g).reverse().join('')}`)
}


/**
 * Function to convert given IP address to the correct format
 * - Converts 4 Byte IPv4 address to 16 Byte IPv6 address buffer
 * - Else directly converts IPv6 address to buffer
 * - Uses npm IP to verify ip address format
 * @param {*} ipAddress - ip address
 */
const ipToBuffer = (ipAddress) => {
  // if IPv4
  if (ip.isV4Format(ipAddress)){ 
    return Buffer.concat([ // Concatenates buffers to single buffer
      Buffer.alloc(10), // 10 byte buffer
      Buffer.from([0xff, 0xff]), // 2 byte buffer
      ip.toBuffer(ipAddress) // 4 byte buffer
    ]) // if IPv6
  } else if (ip.isV6Format(ipAddress)) {
    return ip.toBuffer(ipAddress); // convert directly to IPv6 buffer
  } else {
    throw new Error('Invalid IP Address!')
  }
}

/**
 * Function hash256 performs a double sha256 hashing on data input and returns result buffer
 * - Uses npm crypto to perform two rounds sha256 hashing 
 * @param {*} input - input to be hashed
 */
const hash256 = (input) => {
  const singleHash = crypto.createHash('sha256').update(input).digest(); // first hash round
  return crypto.createHash('sha256').update(singleHash).digest(); // second hash round
}




module.exports = {
  intToLittleEndian,
  littleEndianToInt,
  ipToBuffer,
  hash256,
  decodeVarInt,
  bufferToBigIntLE,
  bitIntToSafeNumber,
  signedIntToLittleEndian,
  signedLittleEndianToInt,
  encodeVarInt,
  // getNumberTypeAndSize,

}