/**
 * Author : Léo Pichat
 * Mangage the file drop zone
 */


/*
 * Drop files in object import zone
 */
function dropHandlerObject(ev) {
    //Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    if (ev.dataTransfer.items) {
        //Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            //If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].webkitGetAsEntry().isDirectory) {
                showPopupForMilliSeconds("dropZoneObject", "Veuillez mettre uniquement des fichiers.", 4000, false);
                return;
            }
            if (ev.dataTransfer.items[i].kind !== 'file') {
                showPopupForMilliSeconds("dropZoneObject", "Veuillez mettre uniquement des fichiers.", 4000, false);
                return;
            }
        }
        //showPopupForMilliSeconds("dropZoneObject", "File(s) are uploading...", 4000);
        $("#dropZoneObject").popover({"content" : "Uploading du fichier..", "trigger" : "manual"});
        $("#dropZoneObject").popover('show');
        //Upload files on server and load the object in the scene
        uploadFilesOnServerAndLoad(ev.dataTransfer.items);
    }
    $("#dropZoneObject").css('background', 'white');
}

/*
 * Prevent browser's default drop event
 */
function dragOverHandlerObject(ev) {
    $("#dropZoneObject").css('background', '#ffff99');
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

/*
 * Drag leave zone
 */
function dragLeaveHandlerObject(){
    $("#dropZoneObject").css('background', 'white');
}

/*
    * Returns the dropped object's format
    * @param files : the list of the files
    */
function getDroppedFilesFormat(files){
    for (var i = 0; i < files.length; i++){
        var f = files[i].getAsFile().name.toLowerCase();
        if (f.includes(".fbx"))
            return "fbx";
        else if (f.includes(".obj"))
            return "obj";
        else if (f.includes(".glb") || f.includes(".gltf"))
            return "gltf";
        else if (f.includes(".json"))
            return "json";
    }
    return null;
}

/*
 * Returns the file's name of the object
 * @param files : the list of the files
 */
function getDroppedFilesObjectName(files){
    for (var i = 0; i < files.length; i++){
        var f = files[i].getAsFile().name.toLowerCase();
        if (f.includes(".fbx") || f.includes(".obj") ||
            f.includes(".glb") || f.includes(".gltf")){
            return f;
        }
    }
}
