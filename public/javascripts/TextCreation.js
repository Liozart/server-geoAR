/**
 * Author : Léo Pichat
 * Mangage the creation of text objects and the change of their properties (like color or font)
 */

/*
 * Create a new text mesh and call the function to add it to the scene
 */
function addText() {
    //Set the text in the global array
    objects_text[objects_count] = $("#textToAdd").val();
    //Default materials
    var materialFront = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    var materialSide = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
    var materialArray = [ materialFront, materialSide ];
    //Imported fonts contains weight in its name; we don't add it is so
    var finalfontname;
    if (fontName.includes('regular') || fontName.includes('bold'))
        finalfontname = fontName + ".typeface.json";
    else
        finalfontname = fontName + "_" + fontWeight + ".typeface.json";
    //Then load the font and create text object
    var loader = new THREE.FontLoader();
    loader.load( "fonts/" + finalfontname, function ( font ) {
        var geometry = new THREE.TextGeometry( $("#textToAdd").val(), {
            font: font,
            size: 100,
            height: 15,
            curveSegments: 12
        } );
        var textMesh = new THREE.Mesh(geometry, materialArray );

        //geometry.computeBoundingBox();
        //Call the function in index.html to add object to arrays and scene
        addNewObjectToProject(textMesh, myTypes.text);
        $("#textToAdd").val('');
    } );
}

/*
* Recreate a existing text with new color, font or weight
*/
function refreshText(changeColorIn, changeColorOut, bevel = false){
    //Get new colors if wanted
    if (changeColorIn){
        var colorTextIn = new THREE.Color();
        colorTextIn.setHex("0x" + ($("#textColor").val()).replace("#", ""));
        //Retrieve old color
        var colorTextOut = objects[selected_object].material[1].color;

    }
    else
    if (changeColorOut) {
        var colorTextOut = new THREE.Color();
        colorTextOut.setHex("0x" + ($("#textColorOut").val()).replace("#", ""));
        //Retrieve old color
        var colorTextIn = objects[selected_object].material[0].color;
    }
    else {
        //Get actual text colors
        var colorTextIn = objects[selected_object].material[0].color;
        var colorTextOut = objects[selected_object].material[1].color;
    }

    var loader = new THREE.FontLoader();
    var materialFront = new THREE.MeshBasicMaterial( { color: colorTextIn } );
    var materialSide = new THREE.MeshBasicMaterial( { color: colorTextOut } );
    var materialArray = [ materialFront, materialSide ];

    var finalfontname;
    //Imported fonts contains weight in its name; we don't add it is so
    /*if (fontName.includes('regular') || fontName.includes('bold'))
        finalfontname = fontName + ".typeface.json";
    else*/
    finalfontname = fontName + "_" + fontWeight + ".typeface.json";
    //Then load the font and create text object
    loader.load( "fonts/" + finalfontname, function ( font ) {
        //Create options and add bevel parameters if needed
        var options = {
            font: font,
            size: 100,
            height: 12,
            curveSegments: 12
        };
        if (bevel){
            options.bevelEnabled = true;
            options.bevelThickness = 3;
            options.bevelSize = 2;
            options.bevelOffset = 0;
            options.bevelSegments = 3;
        }
        geometry = new THREE.TextGeometry( objects_text[selected_object], options );
        var textMesh = new THREE.Mesh(geometry, materialArray );

        //Put new text in the same position/rotation as the old one
        textMesh.position.copy(objects[selected_object].position);
        textMesh.rotation.copy(objects[selected_object].rotation);
        textMesh.scale.copy(objects[selected_object].scale);
        //geometry.computeBoundingBox();
        //remove old object
        scene.remove(objects[selected_object]);
        //Update object in array
        objects[selected_object] = textMesh;
        //Add to scene and control
        scene.add(textMesh);
        control.attach( textMesh );
        showControlledObjectOptions();
        render();
    } );
}

/*
 * Change selected font
 */
function changeFont(){
    switch (objects_types[selected_object]) {
        case myTypes.text:
            fontName = $("#fonts").val();
            refreshText(false, false, bevel);
            break;

        case myTypes.banner:
            var fname= $("#fonts").val().trim() + '_' + fontWeight;
            objects_class[selected_object].changeTextFont(fname, scene);
            setTimeout(function() {
                render();
            }, 100);
            break;
    }
}

/*
 * Change selected font weight
 */
function changeFontWeight(){
    if (isFontBasic()){
        if ($("#fontWeight").is(":checked"))
            fontWeight = "bold";
        else fontWeight = "regular";
        refreshText(false, false, bevel);
    }
}

function changeBevel(){
    if ($("#bevel").is(":checked"))
        bevel = true;
    else bevel = false;
    refreshText(false, false, bevel);
}

/*
 * Change selected inner text color
 */
function changeColorTextIn(){
    switch (objects_types[selected_object]) {
        case myTypes.text:
            refreshText(true, false, bevel);
            break;
        case myTypes.banner:
            objects_class[selected_object].changeTextColor(
                new THREE.Color().setHex("0x" + ($("#textColor").val()).replace("#", "")), true);
            render();
            break;
    }
}

/*
 * Change selected outer text color
 */
function changeColorTextOut(){
    switch (objects_types[selected_object]) {
        case myTypes.text:
            refreshText(false, true, bevel);
            break;
        case myTypes.banner:
            objects_class[selected_object].changeTextColor(
                new THREE.Color().setHex("0x" + ($("#textColorOut").val()).replace("#", "")), false);
            render();
            break;
    }
}

/*
 * Check if the selected font is one of the basic proposed
 */
function isFontBasic(){
    if (fontName === "helvetiker" || fontName === "optimer" ||
        fontName === "gentilis" || fontName === "droid_sans" ||
        fontName === "droid_serif")
        return true;
    else return false;
}