class Viewer {
    constructor(){
        this.canvas = document.getElementById('id_webglCanvas');
        this.scene = new THREE.Scene();
        this.scene.name = "root scene";
        this.object3D = new THREE.Object3D();
        this.object3D.name = "sceneObject";
        this.scene.add(this.object3D);
        this.sceneObject = this.scene.children[0];
        this.initializeOrUpdateViewer();
        this.camera = undefined;
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.controls = undefined;//trackball or orbit control
        this.rayCaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2(); 
    }

    initializeOrUpdateViewer(){
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        //for perspective camera
        this.fov = 45;
        this.aspect = this.width/this.height;
        this.near = 0.001;
        this.far = 20000;
        //for orthographic camera
        this.left = this.width / -2;
        this.right = this.width / 2;
        this.bottom = this.height / -2;
        this.top = this.height / 2;
    }

    initializeOrthographicCamera(){
        this.camera = undefined;
        // viewer.scene.remove(viewer.scene.children[1]);
        this.removePerspectiveCamera();
        this.initializeOrUpdateViewer();
        this.camera = new THREE.OrthographicCamera(
            this.left,
            this.right,
            this.top,
            this.bottom,
            this.near,
            this.far
        )
        this.camera.name = "orthographic camera";
        this.camera.zoom = 150;
        app.addSpotLightInCamera();
        viewer.scene.add(this.camera);
        this.camera.updateProjectionMatrix();
    }

    removeOrthographicCamera(){
        for(let i = 0;i < this.scene.children.length;++i){
            if(this.scene.children[i].name === "orthographic camera"){
                this.scene.remove(this.scene.children[i]);
            }
        }
    }

    removePerspectiveCamera(){
        for(let i = 0;i < this.scene.children.length;++i){
            if(this.scene.children[i].name === "perspective camera"){
                this.scene.remove(this.scene.children[i]);
            }
        }
    }

    initializePerspectiveCamera(){
        this.camera = undefined;
        // viewer.scene.remove(viewer.scene.children[1]);
        this.removeOrthographicCamera();
        this.initializeOrUpdateViewer();
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            this.aspect,
            this.near,
            this.far
        );
        this.camera.name = "perspective camera";
        app.addSpotLightInCamera();
        viewer.scene.add(this.camera);
        this.camera.updateProjectionMatrix();
    }

    setSceneBackgroundColor(colorCode){
        this.scene.background = new THREE.Color( colorCode );
    }

    movePerspectiveCamera(x, y, z){
        this.camera.position.x = x;
        this.camera.position.y = y;
        this.camera.position.z = z;
    }

    toggleCameraView(){
        if(this.camera instanceof THREE.PerspectiveCamera){
            this.initializeOrthographicCamera();
            app.homePosition();
        }
        else{
            this.initializePerspectiveCamera();
            app.homePosition();
        }
        if(this.controls){
            this.controls.object = this.camera;
        }
    }
}