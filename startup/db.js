const logger = require('./logging');
const mongoose = require('mongoose');

module.exports = function() {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose
    .connect('mongodb://localhost/vidly')
    .then(() => logger.info('Connected to MongoDB...'));
};
