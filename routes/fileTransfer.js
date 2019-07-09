/**
 * Author : Léo Pichat
 * 08/06/2019
 * Routes for web pages and mobile app requests
 */

var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');

var objTmpPath = "./3dObjects/temp/";
var objStorePath = "./3dObjects/storage/";
var objStoreNameExtension = ".glb";

/**
 * Temporary store the imported 3D object from the user : It has to be on the local server to be loaded by Three.js
 * Create a temp folder where the uploaded files are moved,
 * This folder will be erased when files were retrieved back by Three.js
 */
router.post("/tmpStoreFile",function(req,res){
    var lpath = objTmpPath + req.fields.folder;
    //Create the dir
    fs.mkdirSync(lpath, { recursive: true });
    //Then move the file(s) and delete the temp ones
    if (req.files["files[]"].length > 1){
        for (var i = 0; i <  req.files["files[]"].length; i++){
            fs.copyFileSync(req.files["files[]"][i].path, lpath + "/" + req.files["files[]"][i].name);
            fs.unlinkSync(req.files["files[]"][i].path);
        }
    }
    else{
        fs.copyFileSync(req.files["files[]"].path, lpath + "/" + req.files["files[]"].name);
        fs.unlinkSync(req.files["files[]"].path);
    }
    res.status(200).send("ok");
});

/**
 * Send the temporary stored object back to Three.js
 */
router.get('/3dObjects/temp/:folder/:file',function(req,res){
    res.sendFile(req.params["folder"] + "/" + req.params["file"],
        { root: path.join(__dirname, '../3dObjects/temp')});
});

/**
 * Remove the temporary stored and sended 3D object
 */
router.get("/tmpRemoveFiles/:folder",function(req,res){
    rimraf.sync(objTmpPath + "/" + req.params["folder"]);
    res.status(200).send("ok");
});

/**
 * Temporary store the imported texture from the user
 */
router.post("/tmpStoreTexture",function(req,res){
    //Move the file(s) and delete the temp ones
    if (req.files["files[]"].length > 1){
        for (var i = 0; i <  req.files["files[]"].length; i++){
            fs.copyFileSync(req.files["files[]"][i].path, objTmpPath + "/" + req.files["files[]"][i].name);
            fs.unlinkSync(req.files["files[]"][i].path);
        }
    }
    else{
        fs.copyFileSync(req.files["files[]"].path, objTmpPath + "/" + req.files["files[]"].name);
        fs.unlinkSync(req.files["files[]"].path);
    }
    res.status(200).send("ok");
});

/**
 * Send the temporary stored texture back to Three.js
 */
router.get('/3dObjects/temp/:file',function(req,res){
    res.sendFile(req.params["file"],
        { root: path.join(__dirname, '../3dObjects/temp')});
});

/**
 * Remove the imported texture
 */
router.get("/tmpRemoveTexture/:file",function(req,res){
    rimraf.sync(objTmpPath + "/" + req.params["file"]);
    res.status(200).send("ok");

});

/**
 * Store an exported object to the storage folder
 * This object will have a unique generated name to be linked with the DB's geographics infos
 */
router.post("/storeObject",function(req,res) {
    var objName = generateObjectName();
    fs.copyFileSync(req.files["files[]"].path, objStorePath + "/" + objName);
    fs.unlinkSync(req.files["files[]"].path);
    res.status(200).send(objName);
});

/**
 * Send objects by their names
 */
router.get("/getObjects/:name", function(req,res){
    console.log("get : "+req.params["name"]);
    res.sendFile(req.params["name"],
        { root: path.join(__dirname, '../3dObjects/storage/')});
});

/**
 * Generate a unique 24 chars random string as name for the newly created object
 */
function generateObjectName(){
    var name = "";
    var range = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    do {
        for (var i = 0; i < 24; i++)
            name += range.charAt(Math.floor(Math.random() * range.length));
        if (!fs.existsSync(objStorePath + "/" + name))
            return name + "" + objStoreNameExtension;
    } while (true);
}

module.exports = router;
