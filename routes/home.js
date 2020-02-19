const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'My RESTful API', message: 'Hello' });
});

module.exports = router;
