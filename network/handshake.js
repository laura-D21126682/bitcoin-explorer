const { versionMessage, verackMessage } = require('../services/messageService');
const messageHandler = require('./messageHandler');
const logger = require('../utils/logger'); // Custom winston logger
const chalk = require('chalk'); // Colour variables

// Function handles the handshake process - Exits on success or time-out
const handshake = (socket, address) => {
  return new Promise((resolve) => {

    let successfulHandshake = false;

    // 1. Send Version Message
    const networkVersionMessage = versionMessage(); 
    socket.write(networkVersionMessage);
    logger.info(`Sent Message ${chalk.greenBright(`version`)}`);
    

    // Listens and responds to incoming messages by type
    socket.on('data', (data) => messageHandler(socket, data, address));

 
    /**
     * Performed Handshake Event
     * - Signals success
     * - Updates successfulHandshake variable
     * - resolves node address
     */
    socket.once('performedHandshake', () => {
      successfulHandshake = true;
      resolve(true);
    });

  /**
   * Time-out Function is called every 8 seconds
   * - If handshake attempt unsuccessful, connection is closed and resolves false
   */
    setTimeout(() => {
      if (!successfulHandshake) { 
        logger.warn(`Handshake Timed Out with Node: ${address}`);
        socket.destroy(); 
        resolve(false); 
      }
    }, 8000); // 8 second timeout
  });
}

module.exports = handshake;