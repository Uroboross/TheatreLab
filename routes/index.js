var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Play' });
});
router.get('/play', function(req, res, next) {
    res.send(JSON.stringify([
        {name: "Odesseya", author: "Gomer"},
        {name: "Natalka Poltavka", author: "Kotlyarevskii"},
        {name: "Imperia Angelov", author: "Veber"}
    ]));
});

module.exports = router;
