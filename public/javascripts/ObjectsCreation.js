/**
 * Author : Léo Pichat
 * Mangage the creation of basic objects (currently cube, plane, cylinder)
 */

/*
 * Add a new object to the scene and to the objects array
 * @param object : The mesh object to add to the scene and array
 * @param type : The object's myTypes type
 */
function addNewObjectToProject(object, type){
    //Set object in global object array
    objects[objects_count] = object;
    //Set object type
    objects_types[objects_count] = type;
    //Init object animation array
    //objects_anim[objects_count] = 0;
    selected_object = objects_count;
    objects_count++;
    //Add to scene and control
    scene.add( object );
    control.attach( object );
    showControlledObjectOptions();
    render();
}

/*
 * Create a new cube and call the function to add it to the scene
 */
function addCube() {
    var color = new THREE.Color();
    color.setHex("0x" + ($("#objColor").val()).replace("#", ""));
    var geometry = new THREE.BoxGeometry(100, 100, 100);
    var material = new THREE.MeshLambertMaterial( { color: color,
        transparent: true, opacity: 1.0} );
    var cube = new THREE.Mesh( geometry, material );
    cube.castShadow = true;
    cube.receiveShadow = true;
    //Call the function in index.html to add object to arrays and scene
    addNewObjectToProject(cube, myTypes.basic);
}

/*
 * Create a new plane and call the function to add it to the scene
 */
function addPlane() {
    var color = new THREE.Color();
    color.setHex("0x" + ($("#objColor").val()).replace("#", ""));
    var geometry = new THREE.PlaneGeometry(100, 100);
    var material = new THREE.MeshLambertMaterial( { color: color, side: THREE.DoubleSide,
        transparent: true, opacity: 1.0} );
    var plane = new THREE.Mesh( geometry, material );
    plane.castShadow = true;
    plane.receiveShadow = true;
    //Call the function in index.html to add object to arrays and scene
    addNewObjectToProject(plane, myTypes.basic);
}

/*
 * Create a new cylinder and call the function to add it to the scene
 */
function addCylinder(){
    var color = new THREE.Color();
    color.setHex("0x" + ($("#objColor").val()).replace("#", ""));
    var geometry = new THREE.CylinderGeometry(100, 100, 100, 100);
    var material = new THREE.MeshLambertMaterial( { color: color,
        transparent: true, opacity: 1.0} );
    var cylinder = new THREE.Mesh( geometry, material );
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    //Call the function in index.html to add object to arrays and scene
    addNewObjectToProject(cylinder, myTypes.basic);
}