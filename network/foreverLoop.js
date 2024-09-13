
const { logger } = require('../utils/logHandler');
const commandHandler = require('../network/commandHandler');
const { pingMessage } = require('../builders/messageBuilder');


/**
 * Forever Loop handles ongoing processes after successful handshake
 * - Connection is kept open by responding to Ping messages with Pong and sending out interval timed Pings
 */
  const foreverLoop = async (socket, address) => {
    return new Promise((resolve) => {
      logger('success', '❤️❤️ Entering Foreverloop with', address, '❤️❤️');
      let handshakeComplete = true; // need to pass to command handler for switch logic
  
      // Listens and responds to incoming messages by type
      socket.on('data', (data) => commandHandler(socket, data, address, handshakeComplete));
    
      // Ping node every 30 seconds to keep connection alive
      const pingTimer = setInterval(() => {
        try{
          const networkPingMessage = pingMessage();
          socket.write(networkPingMessage);
          logger('info', 'ForeverLoop.pingTimer: Handshake Status:', handshakeComplete);
          logger('info', 'ForeverLoop.pingTimer: Sent Message Ping to:', address);
        } catch (err) {
          logger('error', err, 'PingTimer.setInterval:', address)
        }
      }, 20000); // 30 second timeout

      // Listen for 
      socket.once('handshakeBroken', (err) => {
        logger('error', err, 'ForeverLoop.handshakeBroken:', address);
        handshakeComplete = false;
        clearInterval(pingTimer); // clean up
        resolve(false); // exits with promise with false if the handshake is broken
      });

  });
} 

module.exports = foreverLoop;
