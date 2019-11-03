const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/data', (req, res) => {
  console.log('get data');
});

module.exports = router;
