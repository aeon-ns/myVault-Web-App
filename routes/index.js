var express = require('express');
var router = express.Router();
var dir = require('../service.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(__dirname);
  console.log(dir);
  res.sendFile(dir+'/views/home.html');
});

module.exports = router;
