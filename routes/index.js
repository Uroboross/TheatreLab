var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Play' });
});
router.get('/play/first_play', function(req, res, next) {
    res.send(JSON.stringify({ a: 1, b: "222", c: "hello" }));
});

module.exports = router;
