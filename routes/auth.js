const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  try {
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send('Invalid email or password.');

    const token = jwt.sign({ _id: user._id }, 'jwtPrivatekey');

    res.send(token);
  } catch (error) {
    res.status(500).send('Something failed - please try again.');
  }
});

// Joi schema validation
function validate(req) {
  const schema = Joi.object({
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  });

  return schema.validate(req);
}

module.exports = router;
