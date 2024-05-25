
const net = require('net');
const logger = require('../utils/logger');
const chalk = require('chalk'); // colour variables

/**
 * Function creates TCP connection on Bitcoin Network
 * - connect to DNS Seed
 * - Promise resolves with tcp connection or rejects if error
 * @param {*} port - Port number to connect to, Bitcoin Mainnet: 8333
 * @param {*} host - DNS Seed to connect to
 */
const createConnection = (port, host) => {
  return new Promise((resolve, reject) => { 
    
    // Create tcp connection
    const socket = net.createConnection({ port, host });

    // Event listener - Successful connection
    socket.once('connect', () => {
      logger.success(`TCP connection success at: ${chalk.cyanBright(`${host}:${port}`)}`);
      resolve(socket);
    });

    // Event listener - Error
    socket.once('error', (err) => { 
      logger.error(`TCP connection failure, error connecting ${chalk.redBright(`${host}:${port}`)}: ${err}`);
      socket.destroy()
      reject(err);
    });

    // Event listener - gracefully end connection
    socket.once('end', () => logger.warn(`TCP connection ending ${chalk.yellowBright(`${host}:${port}`)}`));

    // Event listener - Disconnect
    socket.once('close', (err) => {
      if(err) {
        logger.warn(`TCP connection closed with error '${err}' ${chalk.yellowBright(`${host}:${port}`)}`);
      } else {
        logger.warn(`TCP connection closed ${chalk.yellowBright(`${host}:${port}`)}`);
      }
        
    });
    
  });
}


module.exports = createConnection;