var express = require('express');
var router = express.Router();

var payment = require('./payment');
var notification = require('./notification');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/payment', payment);
router.use('/notification', notification);

module.exports = router;
