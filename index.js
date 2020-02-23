const logger = require('./startup/logging');
const winston = require('./startup/logging');
const config = require('config');
const morgan = require('morgan');
const debug = require('debug')('app:startup');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();

process.on('uncaughtException', ex => {
  logger.error(ex.message, ex);
  process.exit(1);
});

process.on('unhandledRejection', ex => {
  throw ex;
});

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
  app.use(morgan('combined', { stream: winston.stream }));
  debug('Morgan enabled...');
}

// Set port dynamically based on environment
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
