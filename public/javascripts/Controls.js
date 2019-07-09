/**
 * Author : Léo Pichat
 * Mangage controls of the objects in the scene
 */

//Manage the pressed key to change object's control
window.addEventListener( 'keydown', function ( event ) {
    switch ( event.keyCode ) {
        /*case 81: // Q
            control.setSpace( control.space === "local" ? "world" : "local" );
            break;*/
        case 17: // Ctrl
            control.setTranslationSnap( 20 );
            control.setRotationSnap( THREE.Math.degToRad( 15 ) );
            break;
        case 87: // W
            control.setMode( "translate" );
            break;
        case 69: // E
            control.setMode( "rotate" );
            break;
        case 82: // R
            control.setMode( "scale" );
            break;
        case 83: // S
            switchObjectControl();
            break;
        case 46: // Delete
            removeObject();
            break;
    }
} );
window.addEventListener( 'keyup', function ( event ) {
    switch ( event.keyCode ) {
        case 17: // Ctrl
            control.setTranslationSnap( null );
            control.setRotationSnap( null );
            break;
    }
} );

/*
* Switch transform control to the next object and show options
*/
function switchObjectControl(){
    //Switch controls to next object
    if (objects_count === 0) return;
    if (selected_object === objects_count || selected_object === (objects_count - 1))
        selected_object = 0;
    else selected_object++;
    control.attach(objects[selected_object]);

    showControlledObjectOptions();
}

/*
 * Remove current controlled object
 */
function removeObject(){
    scene.remove(objects[selected_object]);
    objects.splice(selected_object, 1);
    objects_count--;
    if (objects_count === 0){
        control.detach();
        selected_object = null;
    }
    else {
        selected_object = 0;
        control.attach(objects[selected_object]);
    }
    showControlledObjectOptions();
    render();
}

/*
 * Toggle advanced control panel (basic forms, text)
 */
function toggleAdvancedControls() {
    if (!areAdvancedControlsToggled){
        areAdvancedControlsToggled = true;
        $("#toggleAdvanced").html("Cacher contrôles avancés");
        $("#advancedControls").show();
    }
    else{
        areAdvancedControlsToggled = false;
        $("#toggleAdvanced").html("Montrer contrôles avancés");
        $("#advancedControls").hide();
    }
}

/*
 * Show selected object options
 */
function showControlledObjectOptions(){
    //Hide everything then show the right options
    hideAllOptions();
    switch (objects_types[selected_object]) {
        case myTypes.basic:
            $("#optionColor").show();
            $("#optionOpacity").show();
            break;
        case myTypes.text:
            $("#optionText").show();
            break;
        case myTypes.importedObject:
            $("#optionOpacity").show();
            break;
        case myTypes.banner:
            $("#optionColor").show();
            $("#optionOpacity").show();
            $("#optionTextBanner").show();
            $("#optionText").show();
            break;
        case myTypes.ellipse:
            $("#optionOpacity").show();
    }
    $("#optionAnimation").show();
}

/*
 * Hide all options
 */
function hideAllOptions(){
    $("#optionColor").hide();
    $("#optionOpacity").hide();
    $("#optionText").hide();
    $("#optionAnimation").hide();
}
