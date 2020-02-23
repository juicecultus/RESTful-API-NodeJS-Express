const logger = require('../config/winston');

module.exports = function(err, req, res, next) {
  logger.error(err.message, err);

  res.status(500).send('Something failed.');
};
