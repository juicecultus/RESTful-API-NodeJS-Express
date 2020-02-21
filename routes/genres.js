const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// DB stored in MongoDB
const Genre = mongoose.model(
  'Genre',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    }
  })
);

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
      .min(3)
      .required()
  });

  return schema.validate(genre);
}

// Handle GET requests
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

// Handle POST requests
router.post('/', async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

// Handle PUT requests
router.put('/:id', async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true, useFindAndModify: false }
  );

  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

// Handle DELETE requests
router.delete('/:id', async (req, res) => {
  const genre = await Genre.findOneAndDelete(req.params.id, {
    useFindAndModify: false
  });

  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

module.exports = router;
