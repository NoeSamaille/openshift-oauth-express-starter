var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Not yet implemented.');
});

/* GET users listing. */
router.get('/me', function(req, res, next) {
  res.json(req.user);
});

module.exports = router;
