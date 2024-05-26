
const { verackMessage, pongMessage } = require('../services/messageService');
const parseHeader = require('../services/parsingServices');
const logger = require('../utils/logger');
const chalk = require('chalk');
    
    
// Listen for incoming messages to complete handshake
const messageHandler = (socket, data, address) => { 
  
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
      logger.info(`Sent Message ${chalk.greenBright(`verack`)} to ${chalk.greenBright(`${address}`)}`);
      break;
    case 'verack': // 4. Received Verack Message = handshake complete
      logger.info(`Received Message ${chalk.greenBright(`verack`)} from ${chalk.greenBright(`${address}`)}`);
      socket.emit('performedHandshake'); // Emit successful handshake event
      break;
    case 'ping': // 2. Received Version Message
      logger.info(`Received Message ${chalk.greenBright(`${command}`)} from ${chalk.greenBright(`${address}`)}`);
      const networkPongMessage = pongMessage(); // 3. Send verack msg upon receiving version
      socket.write(networkPongMessage);
      logger.info(`Sent Message ${chalk.greenBright(`pong`)} to ${chalk.greenBright(`${address}`)}`);
      break;
    case 'pong': // 2. Received Version Message
      logger.info(`Received Message ${chalk.greenBright(`${command}`)} from ${chalk.greenBright(`${address}`)}`);
      break;
    case 'inv': // 4. Received Verack Message = handshake complete
      logger.info(`Received Message ${chalk.greenBright(`${command}`)} from ${chalk.greenBright(`${address}`)}`);
      logger.verbose(`TODO: Implement 'inv' handling logic`);
      break;  
    default: // Logs any other msg types received
      logger.info(`Received Message ${chalk.blackBright(`${command}`)} from ${chalk.blackBright(`${address}`)}`); 
  } 
};


module.exports = messageHandler;