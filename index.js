const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();

// Set port dynamically based on environment
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
