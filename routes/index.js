/**
 * Author : Léo Pichat
 * 08/06/2019
 * Routes for web pages
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get("/map.html", function(req, res, next) {
    res.render('map');
});

module.exports = router;
