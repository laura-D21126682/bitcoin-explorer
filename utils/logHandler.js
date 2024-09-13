const log = require('./logConfig');
const chalk = require('chalk');


const logger = (logLevel, ...args) => {

  const context = args.join(' ');
  
  switch (logLevel) {
    case 'error': 
      log.error(context);
      break;
    case 'warn': 
      log.warn(context);
      break;
    case 'info': 
      log.info(context);
      break;
    case 'verbose': 
      log.info(context);
      break;
    case 'debug': 
      log.debug(context);
      break;
    case 'success':
      log.success(context);
      break;
    case 'block':
      log.block(context);
      break;
    case 'tx':
      log.tx(context);
      break;
  } 
}

module.exports = {
  logger,
};