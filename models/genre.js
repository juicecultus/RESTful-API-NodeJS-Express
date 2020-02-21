const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

// DB stored in MongoDB
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Genre = mongoose.model('Genre', genreSchema);

// DB stored in local memory
// const genres = [
//   { id: 1, name: 'Action' },
//   { id: 2, name: 'Horror' },
//   { id: 3, name: 'Romance' }
// ];

// Joi schema validation
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
  });

  return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;
