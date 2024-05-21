
const net = require('net');

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
      console.log(`Connected to node ${host}:${port}`)
      resolve(socket);
    });

    // Event listener - Error
    socket.once('error', (err) => { 
      console.error(`Error connecting to node ${host}:${port}: `, err);
      reject(err);
    });

    // Event listener - Disconnect
    socket.once('end', () => console.log(`Disconnected from node ${host}:${port}`));
  });
}

module.exports = createConnection;