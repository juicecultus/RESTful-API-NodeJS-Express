require('express-async-errors');
require('winston-mongodb');
const winston = require('./config/winston');
const logger = require('./config/winston');
const config = require('config');
const morgan = require('morgan');
const debug = require('debug')('app:startup');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const app = express();

require('./startup/routes')(app);

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

mongoose
  .connect('mongodb://localhost/vidly', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(() => console.error('Could not connect to MongoDB...'));

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
