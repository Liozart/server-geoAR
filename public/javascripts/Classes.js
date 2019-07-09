/**
 * Author : Léo Pichat
 * Pre-made objects classes and utils functions (currently a simple banner and a logo with user's texture)
 */


/*
* Add a premade object to the scene (see classes)
*/
var dialog;
function addPremadeObject(which){
    switch (which) {
        //Banner
        case 1:
            bootbox.prompt("Entrez le texte à afficher", function(text) {
                var banner = new Banner(text);
                banner.createBanner().then(
                    function(group){
                        //Add object to arrays
                        addNewObjectToProject(group, myTypes.banner);
                        objects_class[selected_object] = banner;
                        render();
                    }
                );
            });
            break;
        //Ellipse
        case 2:
            dialog = bootbox.dialog({
                message: 'Entrez l\'image à afficher : <br/><input type="file" onchange="setEllipseTexture(dialog);" id="ellipseFile">',
                closeButton: true
            });
            break;
    }
}

/*
 * Called when the ellipse texture dialog file is set
 * @param the dialog containing the infos
 */
function setEllipseTexture(dialog) {
    dialog.modal('hide');
    var file = document.getElementById('ellipseFile').files[0];
    lastUploadedTextureName = file.name;
    var fdata = new FormData();
    fdata.append("files[]", file);
    fetch(storeTextureURL, {
        method: 'POST',
        body: fdata,
    }).then(response => {
        if (response.ok) {
            var ellipse = new Ellipse(file.name);
            ellipse.createEllipse().then(
                function(mesh){
                    //Add object to arrays
                    addNewObjectToProject(mesh, myTypes.ellipse);
                    objects_class[selected_object] = ellipse;
                    rotateObject(mesh, 90, 90, 0);
                    removeTempTexture();
                    render();
                }
            );
        }
    });
}

/*
 * --------------------------------------------------------Banner class--------------------------------------------------------------------
 */
class Banner {
    constructor(bannertext) {
        this.color_plane = new THREE.Color();
        this.color_plane.setHex("0x00ff00");

        this.color_text_in = new THREE.Color();
        this.color_text_in.setHex("0xff0000");

        this.color_text_out = new THREE.Color();
        this.color_text_out.setHex("0x0000ff");

        this.banner_text = bannertext;

        this.mesh_plane = null;
        this.mesh_text = null;
        this.mesh_group = new THREE.Group();
    }

    /*
     * Create and return a new banner
     */
    createBanner(){
        var self = this;
        return new Promise(function(resolve, reject){
            //Create text
            var materialFront = new THREE.MeshBasicMaterial( { color: self.color_text_in } );
            var materialSide = new THREE.MeshBasicMaterial( { color: self.color_text_out } );
            var materialArray = [ materialFront, materialSide ];
            var loader = new THREE.FontLoader();
            loader.load( "fonts/helvetiker_regular.typeface.json", function ( font ) {
                var geometry = new THREE.TextGeometry( self.banner_text, {
                    font: font,
                    size: 80,
                    height: 5,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 8,
                    bevelSize: 6,
                    bevelOffset: 0,
                    bevelSegments: 5
                });
                self.mesh_text = new THREE.Mesh(geometry, materialArray);
                self.mesh_text.castShadow = true;
                self.mesh_text.receiveShadow = true;
                var box = new THREE.Box3().setFromObject( self.mesh_text ).getSize();

                //Create back plane
                var geometry = new THREE.PlaneGeometry((box.x + 40), 130);
                var material = new THREE.MeshLambertMaterial( { color: self.color_plane, side: THREE.DoubleSide,
                    transparent: true, opacity: 1.0} );
                self.mesh_plane = new THREE.Mesh( geometry, material );
                self.mesh_plane.castShadow = true;
                self.mesh_plane.receiveShadow = true;

                //Merge the two objects
                self.mesh_group.add( self.mesh_plane );
                self.mesh_group.add( self.mesh_text );
                //Center the text
                self.mesh_plane.position.set((box.x / 2), (box.y / 3), -20.0);
                self.mesh_group.position.set(-(box.x / 2), 100, 0);
                //return the group
                resolve(self.mesh_group);
            });
        });
    }

    /*
     * Change the plane's color
     */
    changePlaneColor(color){
        var self = this;
        self.color_plane = color;
        self.mesh_plane.material.color.setHex(color);
    }

    /*
     * Change the text color
     */
    changeTextColor(color, isColorIn){
        var self = this;
        console.log(color + " " + isColorIn);
        if (isColorIn){
            self.color_text_in = color;
            self.mesh_text.material[0].color.set(self.color_text_in);
        }
        else {
            self.color_text_out = color;
            self.mesh_text.material[1].color.set(self.color_text_out);
        }
    }

    /*
     * Change the text font
     */
    changeTextFont(fontName, scene) {
        var self = this;
        //Create new text mesh
        var materialFront = new THREE.MeshBasicMaterial({color: self.color_text_in});
        var materialSide = new THREE.MeshBasicMaterial({color: self.color_text_out});
        var materialArray = [materialFront, materialSide];
        var loader = new THREE.FontLoader();
        loader.load("fonts/" + fontName + ".typeface.json", function (font) {
            var geometry = new THREE.TextGeometry(self.banner_text, {
                font: font,
                size: 80,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 8,
                bevelSize: 6,
                bevelOffset: 0,
                bevelSegments: 5
            });
            self.mesh_group.remove(self.mesh_text);
            scene.remove(self.mesh_text);
            self.mesh_text = null;
            self.mesh_text = new THREE.Mesh(geometry, materialArray);
            self.mesh_text.castShadow = true;
            self.mesh_text.receiveShadow = true;
            self.mesh_group.add(self.mesh_text);
        });
    }
}

/*
 * --------------------------------------------------------Ellipse class--------------------------------------------------------------------
 */

class Ellipse {
    constructor(path) {
        this.color_cylinder = new THREE.Color();
        this.color_cylinder.setHex("0x00ff00");

        this.color_text_in = new THREE.Color();
        this.color_text_in.setHex("0xff0000");

        this.color_text_out = new THREE.Color();
        this.color_text_out.setHex("0x0000ff");

        this.ellipse_texture = 'transfer/3dObjects/temp/' + path;

        this.mesh_ellipse = null;
    }

    /*
    * Create and return a new ellipse
    */
    createEllipse(){
        var self = this;
        return new Promise(function(resolve, reject) {
            var geometry = new THREE.CylinderGeometry(150, 150, 15, 100);
            var texture = new THREE.TextureLoader().load( self.ellipse_texture );

            var material = new THREE.MeshBasicMaterial({
                map: texture
            });
            material.transparent = true;

            self.mesh_ellipse = new THREE.Mesh(geometry, material);
            self.mesh_ellipse.castShadow = true;
            self.mesh_ellipse.receiveShadow = true;
            //Add object to arrays and scene
            resolve(self.mesh_ellipse);
        });
    }

}

//More prefab objects; not implemented
/*class Circulary {
    constructor() {}
}
class Parade {
    constructor() {}
}*/