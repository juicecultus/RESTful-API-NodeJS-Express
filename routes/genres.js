const { Genre, validate } = require('../models/genre');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

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
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

// Handle PUT requests
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
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