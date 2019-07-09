/**
 * Author : Léo Pichat
 * Mangage the export of the objects in the scene
 */

//All meshes in the scene
var final = [];

/*
 * Export the builded object to GLB
 */
function exportSceneToGLB(){
    // Instantiate a exporter
    var exporter = new THREE.GLTFExporter();
    //Check if there is a scene object in the objects array
    //getObjectsAsMeshes(objects);
    getObjectsAsMeshes(objects ,true);

    // Parse the input and generate the glTF output
    exporter.parse( final, function ( gltf ) {
        var file = new Blob( [ gltf ], { type: 'application/octet-stream' } );
        console.log( gltf );
        var fdata = new FormData();
        fdata.append("files[]", file);
        fetch(storeObjectURL, {
            method: 'POST',
            body: fdata,
        }).then(response => {
            if (response.ok) {
                bootbox.alert("Objet exporté vers le server.", function(){
                    //Then redirect to map page
                    response.text().then(function (finalName) {
                        window.location = "/map.html?param=" + finalName;
                    });
                });
            }
        });
    }, {binary : true} );
}

/*
* Get all objects3D and meshes of the scene in an array
* @param array : the global objects array
*/
function getObjectsAsMeshes(iterable, first) {
    console.log(iterable);
    if (first){
        for (var node of iterable) {
            if (node instanceof THREE.Object3D || node instanceof THREE.Scene
                || node instanceof THREE.Group || node instanceof THREE.Mesh) {
                if (/*node instanceof THREE.Object3D ||*/ node instanceof THREE.Scene || node instanceof THREE.Group)
                    getObjectsAsMeshes(node, false);
                else {
                    final.push(node);
                }
            }
        }
    }
    else
        iterable.traverse(function (node) {
            if (iterable !== node && (node instanceof THREE.Object3D || node instanceof THREE.Scene
                || node instanceof THREE.Group || node instanceof THREE.Mesh)) {
                if (/*node instanceof THREE.Object3D ||*/ node instanceof THREE.Scene|| node instanceof THREE.Group)
                    getObjectsAsMeshes(node, false);
                else {
                    final.push(node);
                }
            }
        });
    console.log(final);
}