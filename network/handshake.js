const { logger } = require('../utils/logHandler');
const { versionMessage } = require('../builders/messageBuilder');

const commandHandler = require('../network/commandHandler');



// Function handles the handshake process - Exits on success or time-out
const handshake = async (socket, address) => {
  return new Promise((resolve) => {

    let handshakeComplete = false;

    const networkVersionMessage = versionMessage();     // 1. Send Version Message
    socket.write(networkVersionMessage);
    logger('info', 'Handshake: Sent Message Version:', address);

    socket.once('data', (data) => {
      commandHandler(socket, data, socket.remoteAddress, handshakeComplete);
    });

    // setTimeout function - 5 seconds
    const timeout = setTimeout(() => {
      if (!handshakeComplete) { 
        logger('warn', 'Handshake: Timed out with:', address);
        handshakeComplete = false; 
        socket.cleanup(); 
        // socket.clearDataListener(onData); // socket.off
        resolve(false); // promise resolves false
      }
    }, 5000); 

    // Performed handshake event, emmitted by handleVerack function  
    // Clear timeout event but keep socket open for foreverLoop 
    socket.once('performedHandshake', () => {
      handshakeComplete = true; // update handshake status
      logger('debug', 'Handshake Complete: ', handshakeComplete);
      clearTimeout(timeout);
      resolve(true); // resolve promise
    });

  });
}



module.exports = handshake;