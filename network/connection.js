
const createConnection = require('./create-connection');
const getIps = require('./dns_resolver');
const { versionMessage, verackMessage } = require('../services/messageService');
require('dotenv').config();

// Import .env vars
const BTC_PORT = process.env.BTC_PORT;
const DNS_SEED = process.env.DNS_SEED;



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

        // 1. Send version message
        const networkVersionMessage = versionMessage();
        socket.write(networkVersionMessage);
        console.log('Sent: Version Message');

        // Listen for incoming version message
        socket.on('data', (data) => {
          console.log('Received: ', data.toString('hex')); // 2. Receive version message
          const command = data.slice(4, 16).toString('ascii').replace(/\0/g, ''); // Extract command from received message
          console.log(`Received command: ${command}`);


          if (command === 'version') { // If received Version
            const networkVerackMessage = verackMessage(); // 3. Send verack message
            socket.write(networkVerackMessage);
            console.log('Sent: Verack Message');
          } else if (command === 'verack') {
            console.log(`Handshake complete with: ${address}`); // 4. Receive verack message
            // process.exit(0); // Successful handshake exit?
          }
        });

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

/**
 * Handshake Process
 * - Send version message
 * - Receive version message
 * - Send verack message
 * - Receive verack message
 */