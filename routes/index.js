const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/stats', function (req, res) {
  res.send('ok');
});

module.exports = router;
