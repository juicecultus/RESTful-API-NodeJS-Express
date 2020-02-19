const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('@hapi/joi');
const express = require('express');
const app = express();

app.use(express.json()); // add middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('tiny'));

// DB stored in local memory
const genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Horror' },
  { id: 3, name: 'Romance' }
];

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
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/genres', (req, res) => {
  res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

// Handle POST requests
app.post('/api/genres', (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  genres.push(genre);
  res.send(genre);
});

// Handle PUT requests
app.put('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

// Handle DELETE requests
app.delete('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

// Set port dynamically based on environment
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
