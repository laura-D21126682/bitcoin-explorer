
const winston = require('winston');
const { combine, timestamp, label, printf, colorize } = winston.format;

// custom setup
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    success: 5,
  }

const logColours = {
    error: 'brightRed',
    warn: 'brightYellow',
    info: 'brightGreen',
    verbose: 'brightMagenta',
    debug: 'brightBlue',
    success: 'brightCyan',
  }

winston.addColors(logColours);

// Create logger instance
const logger = winston.createLogger({
  levels: logLevels,
  level: 'success', // ensures all messages of 'success' level (5) or lower are logged 
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    colorize(),
    printf((log) =>`[${log.timestamp}] ${log.level}: ${log.message}`)
  ),
  transports: [new winston.transports.Console()]
});

module.exports = logger;