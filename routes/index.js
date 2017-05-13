var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname+'../views/home.html');
});

module.exports = router;
