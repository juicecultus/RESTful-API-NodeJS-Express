const Joi = require('@hapi/joi');
const moment = require('moment');
const validate = require('../middleware/validate');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

// Handle POST requests
router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('Rental not found.');

  if (rental.dateReturned)
    return res.status(400).send('Rental already processed.');

  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, 'days');
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  await rental.save();

  await Movie.update(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 }
    }
  );

  return res.status(200).send(rental);
});

// Joi schema validation
function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.string()
      .alphanum()
      .required(),
    movieId: Joi.string()
      .alphanum()
      .required()
  });

  return schema.validate(req);
}

module.exports = router;
