/**
 * Author : Léo Pichat
 * 08/06/2019
 * Routes for the database interaction
 */

var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/objdatabase";
var collectionObjInfos = "objects_infos";

var dbConnection;

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Connected to DB..");
    dbConnection = db.db("objdatabase");
    dbConnection.createCollection(collectionObjInfos, function(err, res) {
        if (err) throw err;
        console.log("Collection ready!");
    });
});

/**
 * Add geographic info to the stored object
 * infos : Name, Long, Lat, Height, Orientation
 */
router.post("/addObjectInfo",function(req,res) {
    var entry = { name: req.fields.name, lng: req.fields.lng,
            lat: req.fields.lat, height:req.fields.height, orientation:req.fields.orientation};
    dbConnection.collection(collectionObjInfos).insertOne(entry, function(err, res) {
        if (err) throw err;
        console.log(res);
    });
    res.status(200).send("ok");
});

/**
 * Get the objects infos
 */
router.get("/getObjectInfos",function(req,res) {
    dbConnection.collection(collectionObjInfos).find({}).toArray(function(err, result) {
        if (err) throw err;
        res.status(200).send(result);
    });
});

module.exports = router;
