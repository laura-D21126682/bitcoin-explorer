const { versionMessage, verackMessage } = require('../services/messageService');
const parseHeader = require('../services/parsingServices');
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
    
    // Listen for incoming messages to complete handshake
    const onData = (data) => { 
      const header = parseHeader(data); // parse header of received message

      if ( header === null) { // Handle invalid headers
        logger.error('Invalid Message Format');
        return;
      }

      const command = header.command; // Extract command from header

      // Respond to messages by type
      switch (command) {
        case 'version': // 2. Received Version Message
          logger.info(`Received Message ${chalk.greenBright(`${command}`)} from ${chalk.greenBright(`${address}`)}`);
          const networkVerackMessage = verackMessage(); // 3. Send verack msg upon receiving version
          socket.write(networkVerackMessage);
          logger.info(`Sent Message ${chalk.greenBright(`verak`)}`);
          break;
        case 'verack': // 4. Received Verack Message = handshake complete
          logger.info(`Received Message ${chalk.greenBright(`verak`)} from ${chalk.greenBright(`${address}`)}`);
          successfulHandshake = true;
          resolve(true); // Resolve address on success
          break; 
        default: // Logs any other msg types received
          logger.info(`Received Message ${chalk.blackBright(`${command}`)} from ${chalk.blackBright(`${address}`)}`); 
      } 
    };

    socket.on('data', onData);

  /**
   * Time-out Function is called every 8 seconds
   * - If after 8 secs address has not resoved to true connection is closed and resolves false
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