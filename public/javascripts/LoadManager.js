/**
 * Author : Léo Pichat
 * Mangage the loading of diverse objects format
 * Currently supported : FBX, OBJ, GlTF
 */

/*
 * Load the uploaded glTF object to the scene
 */
function LoadGLTFObject(){
    // Instantiate a loader and set path to temp folder
    var loader = new THREE.GLTFLoader().setPath(tempStorePath + lastUploadedObjectName.split(".")[0] + '/');
    loader.load( lastUploadedObjectName, function ( gltf ) {
            var objs = [];
            gltf.scene.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );
            //add object to scene and array
            addNewObjectToProject(gltf.scene, myTypes.importedObject);
            //Remove files when object is on scene
            removeTempFolder();
        },
        // called while loading is progressing
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {
            $("#dropZoneObject").popover('dispose');
            showPopupForMilliSeconds("dropZoneObject", "Erreur lors du chargement :" + error, 10000, false);
        }
    );
}

/*
 * Load the uploaded OBJ object to the scene
 */
function LoadOBJObject() {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setResourcePath(tempStorePath + lastUploadedObjectName.split(".")[0] + '/');
    mtlLoader.setPath(tempStorePath + lastUploadedObjectName.split(".")[0] + '/');
    mtlLoader.load(lastUploadedObjectName.split(".")[0] + '.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(tempStorePath + lastUploadedObjectName.split(".")[0] + '/');
        objLoader.load(lastUploadedObjectName, function (object) {
            //add object to scene and array
            addNewObjectToProject(object, myTypes.importedObject);
            //Remove files when object is on scene
            removeTempFolder();
        });
    });
}

/*
* Load the uploaded FBX object to the scene
*/
/*function LoadFBXObject() {
    // model
    var loader = new THREE.FBXLoader();
    console.log("loader");
    loader.load(tempStorePath + lastUploadedObjectName.split(".")[0] + '/' + lastUploadedObjectName,
        function (object){
            /*object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );
            console.log("Loaded");
            //add object to scene and array
            addNewObjectToProject(object, myTypes.importedObject);
            //Remove files when object is on scene
            removeTempFolder();
        },
        function ( error ) {
            $("#dropZoneObject").popover('dispose');
            showPopupForMilliSeconds("dropZoneObject", "Erreur lors du chargement :" + error, 10000, false);
            console.log(error);
        });
}*/
