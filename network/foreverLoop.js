const messageHandler = require('./messageHandler');
const { pingMessage } = require('../services/messageService');
const logger = require('../utils/logger');
const chalk = require('chalk');

/**
 * Forever Loop handles ongoing processes after successful handshake
 * - Connection is kept open by responding to Ping messages with Pong and sending out interval timed Pings
 * @param {object} socket - TCP connection
 * @param {string} address - Node IP Address
 */

const foreverLoop = async (socket, address) => {
  
  logger.success(`💗💗💗💗 Entering Foreverloop with ${address}💗💗💗💗`);

  // Listens and responds to incoming messages by type
  socket.on('data', (data) => messageHandler(socket, data, address));


  /**
   * SetInter Function is called every 60 Seconds to keep the connection alive
   * - Sends Ping Message every 60 seconds
   * - If node still alive should respond with pong message 
   */
  setInterval(() => {
    try{
      const networkPingMessage = pingMessage();
      socket.write(networkPingMessage);
      logger.info(`Sent Message ${chalk.greenBright(`ping`)} to ${chalk.greenBright(`${address}`)}`);
    } catch (err) {
      logger.error(`Ping message to ${address} failed: ${err}`);
    }
  }, 30000); // 30 second timeout

}

module.exports = foreverLoop;