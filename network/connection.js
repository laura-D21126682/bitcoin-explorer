
const net = require('net');
const getIps = require('./dns_resolver');
require('dotenv').config();

// Import .env vars
const BTC_PORT = process.env.BTC_PORT;
const DNS_SEED = process.env.DNS_SEED;

// Promise
const createConnection = (port, host) => {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ port, host });
    socket.once('connect', () => {
      console.log(`Connected to node ${host}:${port}`)
      resolve(socket);
    });
    socket.once('error', (err) => { 
      console.error(`Error connecting to node ${host}:${port}`);
      reject(err);
    });
    socket.once('end', () => console.log(`Disconnected from node ${host}:${port}`));
  });
}


const nodeConnection = async () => {
  try {
    // Returns IP addresses of given DNS Seed
    const addresses = await getIps(DNS_SEED);
    // Check if addresses
    if(!addresses || addresses.length === 0) {
      throw new Error('No addresses returned!');
    }

    // Loop through addresses to find a working connection
    for (const address of addresses) { 
      try {
        const socket = await createConnection(BTC_PORT, address);

        // incoming data
        socket.on('data', (data) => {
          console.log('Redeived: ', data.toSring('hex'));
        });

        // TODO: Implement handshake logic
        // Successful connection should exit

      } catch (err) {
        console.error(`Error connecting to address ${address}: `, err);
      } 
    }

  } catch (err){
    console.error('Error: ', err);
  }

}

// run connection
nodeConnection();