const debug = require('debug')('app:startup');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('@hapi/joi');
const logger = require('./middleware/logger');
const genres = require('./routes/genres');
const home = require('./routes/home');
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); // default

app.use(express.json()); // add middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/genres', genres);
app.use('/', home);

app.use(logger);

// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled...');
}

// Set port dynamically based on environment
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
