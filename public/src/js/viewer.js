class Viewer {
    constructor(){
        this.canvas = document.getElementById('id_webglCanvas');
        // this.canvas.style.borderColor = "#000000";
        this.scene = new THREE.Scene();
        this.scene.name = "root scene";
        this.object3D = new THREE.Object3D();
        this.object3D.name = "sceneObject";
        this.scene.add(this.object3D);
        this.sceneObject = this.scene.children[0];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        //for perspective camera
        this.fov = 45;
        this.aspect = this.width/this.height;
        this.near = 0.1;
        this.far = 20000;
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            this.aspect,
            this.near,
            this.far
        );
        this.camera.name = "perspective camera";
        //for orthographic camera
        this.left = this.width / -2;
        this.right = this.width / 2;
        this.bottom = this.height / -2;
        // this.bottom = this.height / 2;
        this.top = this.height / 2;
        // this.top = this.height / -2;
        // this.near = 1;
        // this.far = 1000;

        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.orbitControls = undefined;
        this.rayCaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2(); 
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
            this.camera = undefined;
            this.camera = new THREE.OrthographicCamera(
                this.left,
                this.right,
                this.top,
                this.bottom,
                this.near,
                this.far
            );
            this.camera.zoom = 50;
            this.camera.updateProjectionMatrix();
        }
        else{
            this.camera = undefined;
            this.camera = new THREE.PerspectiveCamera(
                this.fov,
                this.aspect,
                this.near,
                this.far
            );
            this.camera.zoom = 2;
            this.camera.updateProjectionMatrix();
        }
    }
}