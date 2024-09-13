const { Server } = require('socket.io');
const { logger } = require('./utils/logHandler');
const { loadConnection: connectToNode } = require('./network/connection');
const { setIoInstance } = require('./broadcast');

let io;

const websocketSetup = (server, btc_port, btc_host) => {
  try {
    io = new Server(server);
    setIoInstance(io); // set the IO instance for broadcasting

    io.on('connection', (ws) => {
      console.log('connecting to websocket');
      logger('info', 'a user connected');
  
      ws.on('start', async () => {
        console.log('starting websocket....');
        logger('info', 'Start streaming Bitcoin data');
        connectToNode(btc_port, btc_host);
      });
  
      ws.on('stop', () => {
        console.log('stopping websocket....');
        logger('info', 'Stop streaming Bitcoin data');
        // Stop streaming logic here
      });
  
      ws.on('disconnect', () => {
        console.log('disconnecting websocket....');
        logger('info', 'a user disconnected');
      });
    }) // end on connection
  
    return io;

  } catch (err) {
    logger('error', 'connectToWebSocket - Socket.IO connection error:', err);
  }
}; // end connectToWebSocket



module.exports = {
  websocketSetup,
}
