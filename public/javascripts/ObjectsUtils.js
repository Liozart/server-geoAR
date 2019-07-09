/**
 * Author : Léo Pichat
 * Diverse object-related functions
 */

/*
* Change selected object's color
*/
function changeColor(){
    var color = "0x" + ($("#objColor").val()).replace("#", "");
    switch (objects_types[selected_object]) {
        case myTypes.basic:
            objects[selected_object].material.color.setHex(color);
            break;
        case myTypes.banner:
            objects_class[selected_object].changePlaneColor(color);
            break;
    }
    render();
}

/*
 * Change selected object's opacity
 */
function changeOpacity() {
    var opacity = $("#objOpacity").val();
    if (selected_object !== null) {
        //If its a basic mesh
        if (objects[selected_object] instanceof THREE.Mesh){
            objects[selected_object].material.opacity = opacity;
        }
        else {
            //If its an imported object
            objects[selected_object].traverse( function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.opacity = opacity;
                    child.material.transparent = true;
                }
            });
        }
        render();
    }
}

/*
   * Upload the dropped files on the server in the temp folder
   * by calling the php script
   * @param files : the list of the files to upload
   */
function uploadFilesOnServerAndLoad(files) {
    var fdata = new FormData();
    var format;
    for (var i = 0; i < files.length; i++){
        var f = files[i].getAsFile();
        fdata.append("files[]", f);
    }
    //Get object format
    format = getDroppedFilesFormat(files);
    //a font was dropped
    /*if (format === "json"){
        var filename = files[0].getAsFile().name;
        //Download font to server
        fdata = new FormData();
        fdata.append("files[]", files[0].getAsFile());
        fetch(storeFontURL, {
            method: 'post',
            body: fdata,
        }).then(response => {
            if (response.ok) {
                //Add font to list
                $("#fonts").append('<option value="' + filename.split(".")[0].toLowerCase() + '">'
                    + filename.split(".")[0].toLowerCase() + '</option>');
                $("#dropZoneObject").popover('dispose');
                showPopupForMilliSeconds("dropZoneObject", "Police ajoutée.", 4000, false);
            }
        });
    }
    else{*/
    //an object was dropped
    lastUploadedObjectName = getDroppedFilesObjectName(files);
    fdata.append("folder", lastUploadedObjectName.split(".")[0]);
    fetch(storeFileURL, {
        method: 'POST',
        headers: {
        },
        body: fdata
    }).then(response => {
        if (response.ok){
            $("#dropZoneObject").popover('dispose');
            showPopupForMilliSeconds("dropZoneObject", "Fichier uploadé. Chargement de l'objet..", 3000, false);
            //Load model into scene when uploaded
            switch (format) {
                case "fbx": LoadFBXObject();
                    break;
                case "obj": LoadOBJObject();
                    break;
                case "gltf": LoadGLTFObject();
                    break;
            }
        }
        else {
            $("#dropZoneObject").popover('dispose');
            showPopupForMilliSeconds("dropZoneObject", "Erreur lors de l'upload", 4000, false);
        }
    });
    //}
}

/*
 * Remove the temp folder containing loaded object
 */
function removeTempFolder(){
    fetch(removeFileURL + "/" + lastUploadedObjectName.split(".")[0], {
        method: 'get'
    }).then(response => {
        if (!response.ok){
            $("#dropZoneObject").popover('dispose');
            showPopupForMilliSeconds("dropZoneObject", "Erreur lors de l'effacement du fichier temp", 4000, false);
        }
    });
}

/*
 * Remove the temp texture
 */
function removeTempTexture(){
    fetch(removeTextureURL + "/" + lastUploadedTextureName, {
        method: 'get'
    });
}

/*
* Windows quit event : remove imported fonts
*/
/*window.onbeforeunload = function (e) {
    var fdata = new FormData();
    fetch(removeFontsURL, {
        method: 'POST',
        body: fdata,
    });
};*/

/*
 * Load the imported texture on the current selected object
 * won't work on imported objects
 */
/*function LoadTextureToSelectedObject(){
    const loader = new THREE.TextureLoader();
    loader.load(tempStorePath + lastUploadedTextureName, (texture) => {
        const material = new THREE.MeshBasicMaterial({
            map: texture,
        });
        //Check if object basic/text
        if (objects[selected_object] instanceof THREE.Mesh) {
            objects[selected_object].material.texture = texture;
            objects[selected_object].material.texture.needsUpdate = true;
            //Finally render and remove texture from server
            render();
            removeTempTexture();
        }
    });
}*/

/*
 * Rotate an object with angles
 */
function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
    object.rotateX(THREE.Math.degToRad(degreeX));
    object.rotateY(THREE.Math.degToRad(degreeY));
    object.rotateZ(THREE.Math.degToRad(degreeZ));
}