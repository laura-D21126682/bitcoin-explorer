
const { verackMessage, pongMessage, getDataMessage } = require('../services/messageService');
const Header = require('../messages/header');
const Inv = require('../messages/inv');
const logger = require('../utils/logger');
const chalk = require('chalk');
    
    
// Listen for incoming messages to complete handshake
const messageHandler = (socket, data, address) => { 
  
  const header = Header.parse(data); // parse header of received message

  if ( header === null) { // Handle invalid headers
    logger.error('Invalid Message Format');
    return;
  }

  const command = header.command; // Extract command from header
  const payload = data.slice(24); // Extract payload after the header(24 bytes)

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
    case 'ping':
      logger.info(`Received Message ${chalk.greenBright(`${command}`)} from ${chalk.greenBright(`${address}`)}`);
      const networkPongMessage = pongMessage(); // 3. Send verack msg upon receiving version
      socket.write(networkPongMessage);
      logger.info(`Sent Message ${chalk.greenBright(`pong`)} to ${chalk.greenBright(`${address}`)}`);
      break;
    case 'pong':
      logger.info(`Received Message ${chalk.greenBright(`${command}`)} from ${chalk.greenBright(`${address}`)}`);
      break;
    case 'inv': // 4. Received Verack Message = handshake complete
      logger.info(`Received Message ${chalk.greenBright(`${command}`)} from ${chalk.greenBright(`${address}`)}`);
      const invMessage = Inv.parse(payload);
      logger.info(`Parsed Message ${chalk.greenBright(`${command}`)} ${chalk.greenBright(JSON.stringify(invMessage))}`);
      const networkGetDataMessage = getDataMessage(invMessage.inventory); // Creates serialsed getData with inv payload
      socket.write(networkGetDataMessage); // send getData message as response to inv
      logger.info(`Sent Message ${chalk.greenBright(`getData`)} to ${chalk.greenBright(`${address}`)}`);
      break; 
    default: // Logs any other msg types received
      logger.info(`Received Message ${chalk.blackBright(`${command}`)} from ${chalk.blackBright(`${address}`)}`); 
  } 
};


module.exports = messageHandler;