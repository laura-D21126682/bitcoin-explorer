const { logger } = require('../utils/logHandler');
const { handleVersion, handleVerack, handlePing, handlePong, handleInv, handleBlock, handleTx } = require('./messageHandler');

let buffer = Buffer.alloc(0);

// Listen for incoming messages to complete handshake
const commandHandler = (socket, data, address, handshakeComplete) => { 
  buffer = Buffer.concat([buffer, data]);

  while (buffer.length >= 24) {
    const header = buffer.slice(0, 24); // Extract the header
    const payloadLength = header.readUInt32LE(16); // Extract the payload length (4 bytes starting from the 16th byte)

    if (buffer.length >= 24 + payloadLength) { // Check if complete message
      const payload = buffer.slice(24, 24 + payloadLength); // Extract the payload
      const command = header.slice(4, 16).toString('ascii').replace(/\0/g, '');
      
      try{
        ProcessMessage(command, socket, address, payload); // Process the message
      } catch (err) {
        logger('error', err, 'CommandHandler Error:', command, 'from', address );
      }
      
      buffer = buffer.slice(24 + payloadLength); // Remove the processed message from the buffer
    } else {
      // Wait for more data
      break;
    }
  }
};

function ProcessMessage(command, socket, address, payload) {
  switch (command) {
    case 'version':
      handleVersion(socket, address);
      break;
    case 'verack': // Received Verack Message = handshake complete
      handleVerack(socket, address);
      break;
    case 'ping':
      handlePing(socket, address)
      break;
    case 'pong':
      handlePong(socket, address);
      break;
    case 'inv':
      handleInv(socket, address, payload);
      break;
    case 'block':
      handleBlock(address, payload);
      break;
    case 'tx':
      handleTx(address, payload);
      break;
    default: // Logs any other msg types received
      logger('info','Ignore', command, 'from', address );
  } 
}

module.exports = commandHandler;