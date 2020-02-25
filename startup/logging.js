require('winston-mongodb');
require('express-async-errors');
const winston = require('winston');
const appRoot = require('app-root-path');
// const morgan = require('morgan');
// const debug = require('debug')('app:startup');

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
    new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly' })
  ],
  exitOnError: false // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  }
};

process.on('uncaughtException', ex => {
  logger.error(ex.message, ex);
  process.exit(1);
});

process.on('unhandledRejection', ex => {
  throw ex;
});

// if (app.get('env') === 'development') {
//   app.use(morgan('combined', { stream: winston.stream }));
//   debug('Morgan enabled...');
// }

module.exports = logger;
