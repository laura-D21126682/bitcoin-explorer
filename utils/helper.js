
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


/**
 * Function to convert given IP address to the correct format
 * - Converts 4 Byte IPv4 address to 16 Byte IPv6 address buffer
 * - Else directly converts IPv6 address to buffer
 * - Uses npm IP to verify ip address format
 * @param {*} ip - ip address
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




module.exports = {
  intToLittleEndian,
  ipToBuffer,
}