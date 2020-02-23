const asyncMiddleware = require('../middleware/async');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { Genre, validate } = require('../models/genre');
const express = require('express');
const router = express.Router();

// Handle GET requests
router.get(
  '/',
  asyncMiddleware(async (req, res, next) => {
    try {
      const genres = await Genre.find().sort('name');
      res.send(genres);
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  '/:id',
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre)
      return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
  })
);

// Handle POST requests
router.post(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({ name: req.body.name });
    await genre.save();
    res.send(genre);
  })
);

// Handle PUT requests
router.put(
  '/:id',
  asyncMiddleware(async (req, res) => {
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
  })
);

// Handle DELETE requests
router.delete(
  '/:id',
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findOneAndDelete(req.params.id, {
      useFindAndModify: false
    });

    if (!genre)
      return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
  })
);

module.exports = router;
