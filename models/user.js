const Joi = require('@hapi/joi');
// const PasswordComplexity = require('joi-password-complexity'); // First do: npm install joi-password-complexity
const mongoose = require('mongoose');

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    }
  })
);

// Joi schema validation
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
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

  return schema.validate(user);
}

// Joi-password-complexity validation
// function validateUser(user) {
//   const complexityOptions = {
// 	 min: 5,
// 	 max: 255,
// 	 lowerCase: 1,
// 	 upperCase: 2,
// 	 numeric: 2,
// 	 symbol: 1,
//    requirementCount: 4

/* 
		Min & Max not considered in the count. 
		Only lower, upper, numeric and symbol. 
		requirementCount could be from 1 to 4 
		If requirementCount=0, then it takes count as 4
  */

//  };
//  const schema = {
// 	name: Joi.string().min(5).max(50).required(),
// 	email: Joi.string().min(5).max(255).required().email(),
// 	//password: Joi.string().min(5).max(255).required()
// 	password: new PasswordComplexity(complexityOptions).required()
//  };
//  return Joi.validate(user, schema);
// }

exports.User = User;
exports.validate = validateUser;
