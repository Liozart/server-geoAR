/**
 * Author : Léo Pichat
 * 08/06/2019
 * REST server to distribute web files, download created 3D objects and their informations
 * and send these objects to the mobile app requests
 */

var express = require('express');
var path = require('path');
var formidableMiddleware = require('express-formidable');

var indexRouter = require('./routes/index');
var transferRouter = require('./routes/fileTransfer');
var DBRouter = require('./routes/DBTransfer');

var app = express();
app.use(formidableMiddleware({
    uploadDir: __dirname + '/3dObjects/',
    multiples: true
}));

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '3dObjects')));

/* Accepting CORS for all requests */
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, email, password, shopid, token");
    next();
});

app.use('/', indexRouter);
app.use('/transfer/', transferRouter);
app.use('/database/', DBRouter);

module.exports = app;

app.listen(3000);
console.log("Listening on port 3000..");
