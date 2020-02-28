const express = require('express');
const helmet = require('helmet');
const error = require('../middleware/error');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const returns = require('../routes/returns');
const home = require('../routes/home');

module.exports = function(app) {
  app.set('view engine', 'pug');
  app.set('views', './views'); // default

  app.use(express.json()); // add middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(helmet());
  app.use('/', home);
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/returns', returns);
  app.use(error);
};
