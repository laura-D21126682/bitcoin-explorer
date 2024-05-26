
const createConnection = require('./create-connection');
const logger = require('../utils/logger');
const chalk = require('chalk');
const getIps = require('./dns-resolver');
const handshake = require('./handshake');
const foreverLoop = require('./foreverLoop');
require('dotenv').config();

// Import .env vars
const BTC_PORT = process.env.BTC_PORT;
const DNS_SEED = process.env.DNS_SEED;


/**
 * Function loads ip addresses into connection
 * - Returns IP Addresses from given DNS Seed
 * - Loads addresses into connection function
 * - Initiates connection process
 */
const loadConnection = async (dns_seed) => {
  try { 
    const addresses = await getIps(dns_seed); // Get IP address from DNS Seed 
    if (!addresses || addresses.length === 0){
      logger.error(`DNS Seed returned NO Addresses: ${chalk.redBright(`${dns_seed}`)}`);
      return;
    }
    await connection(addresses); // Initiates node connection process
  } catch (err) { 
    logger.error(`Error Creating Network Connection: ${chalk.redBright(`${err}`)}`);
  }
};

/**
 * Connect to a Bitcoin node - try each address, one at a time, until success
 * Asynchronous: prevents connection processes from blocking event loop
 * - Attempts to establish Bitcoin node connection and perform a handshake
 * - If successful handshake, breaks out of loop and enters 'foreverLoop'
 * - If all atempts fail, reloads and restarts connection process
 */

const connection = async (addresses) => {
  
  let successfulHandshake = false; 

  for (const address of addresses) { 
    // Failsage - If successful handshake, break out of for loop
    if (successfulHandshake) break;

    try {
      const socket = await createConnection(BTC_PORT, address); // Create TCP connection to Bitcoin network address

      const performHandshake = await handshake(socket, address);
      
      if(performHandshake === true) { // On Success
        logger.success(`Successful Handshake ${chalk.cyanBright(`${address}`)}`);
        successfulHandshake = true; // Update variable
        await foreverLoop(socket, address); // awaits - async function 'foreverloop' with successfull address
        break; // Exits for loop
      } else { // Else unsuccessful handshake
        logger.warn(`Unsuccessful Handshake ${chalk.yellowBright(`${address}`)}`);
        socket.destroy(); // Close connection
        continue; // Continue to next function
      }

    } catch (err) { // Catch - node connection errors
      logger.error(`Error Connecting ${chalk.redBright(`${address}`)} - Error: ${chalk.redBright(`${err}`)}`);
    } 
  };// end for loop 
  
  if (!successfulHandshake) { // If no success after for loop completes
    logger.error('Failed to connect to any node');
    loadConnection(DNS_SEED); // Reload Connection & loop through addresses again
  }
};


// Starts connection process with provided DNS Seed
loadConnection(DNS_SEED); 
