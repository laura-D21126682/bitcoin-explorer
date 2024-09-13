
const { logger } = require('../utils/logHandler');
const createConnection = require('./create-connection');
const getIps = require('./dns-resolver');
const handshake = require('./handshake');
const foreverLoop = require('./foreverLoop');


const loadConnection = async (btc_port, ipAddresses) => {
  try {
    logger('info', 'BTC Port:', btc_port);
    logger('info', 'Node:', ipAddresses);
    // Checks if ip address is DNS Seed (String), in which case resolve them, else list of ip addresses 
    const addresses = typeof(ipAddresses) === 'string' ? await getIps(ipAddresses) : ipAddresses;
    // const addresses = await getIps(ipAddresses);

    if (!addresses || addresses.length === 0){
      throw new Error('No addresses returned:', ipAddresses);
    }
    await connection(btc_port, addresses); // Initiates node connection process
  } catch (err) { 
    logger('error', err, 'LoadConnection Error with', ipAddresses);
    return;
  }
};


const connection = async (btc_port, addresses) => {
  let handshakeComplete = false;

  for (const address of addresses) { 
    if (handshakeComplete) break; // Failsafe - If successful handshake, break out of for loop

    try {
      const socket = await createConnection(btc_port, address); // Create TCP connection to Bitcoin network address
      const performHandshake = await handshake(socket, address);
      
      if(performHandshake === true) { // On Success
        handshakeComplete = true; // Update variable
        await foreverLoop(socket, address); // awaits - async function 'foreverloop' with successfull address
        break; // Exits for loop
      } else { // Else unsuccessful handshake
        socket.destroy(); // Close connection
        continue; // Continue to next function
      }

    } catch (err) { // Catch - node connection errors
      logger('error', err, 'Connection Error');
      return;
    } 
  };// end for loop 
  
  if (!handshakeComplete) { // If no success after for loop complete
    logger('warn', 'Connection.handshake Failed');
    loadConnection(btc_port, addresses); // Reload Connection & loop through addresses again
  }
};



module.exports = {
  loadConnection,
}
