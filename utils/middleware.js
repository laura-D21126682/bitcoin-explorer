
const { logger } = require('./logHandler');


// Unkown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint '});
}


// Express error handler - Last stop!
const errorHandler = (err, req, res, next) => {

  // if status 200, something is wrong, set to 500, else res.status
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (req.params.msg) {
    logger('warn', req.params.msg);
  }

  logger('error', 'Status: ', statusCode);
  logger('error', 'Name: ', err.name);
  logger('error', 'Error: ', err.message);


  return res.status(statusCode).json({
    errorName: err.name,
    errorMessage: err.message,
    customMessage: err.custom,
  });

};


module.exports = {
  unknownEndpoint,
  errorHandler,
}