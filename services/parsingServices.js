
const { littleEndianToInt } = require('../utils/helper');
const logger = require('../utils/logger');
const chalk = require('chalk'); // colours variables

/**
 * Function Extracts and returns parsed message header
 * - Param msg -> Buffer
 */
const parseHeader = (msg) => {

  try {
  // First check buffer message is greater than 24 Bytes
  if (msg.length < 24 ){ // If less - too short to be valid message
    logger.info(`Message Length: ${msg.length}`);
    logger.error('Too Short to Parse!'); 
    return null;
  }

  // Extract and parse header elements
  const command = msg.slice(4, 16).toString('ascii').replace(/\0/g, ''); // Extracts and removes null chars
  const magicNumber = msg.slice(0, 4).toString('hex'); // Bitcoin magic number
  const payloadBuffer = msg.slice(16, 20); // Extracts payload buffer
  const payloadLength = littleEndianToInt(payloadBuffer); // Converts to int
  const checksum = msg.slice(20, 24).toString('hex'); // Checksum as hex string

  // Returns parsed header elements as object
  return { magicNumber, command, payloadLength, checksum };
} catch (err) {
  logger.error(`Error Parsing Header: ${err}`);
  return null;
}
}

module.exports = parseHeader;