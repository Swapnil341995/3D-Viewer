class Viewer {
    constructor(){
        this.canvas = document.getElementById('id_webglCanvas');//canvas for main scene
        // this.axisTriadCanvas = document.createElement('canvas');//canvas for axis triad
        this.scene = new THREE.Scene();//main scene
        this.scene.name = "root scene";
        this.axisTriadScene = undefined//scene for axis helper
        this.object3D = new THREE.Object3D();
        this.object3D.name = "sceneObject";
        this.scene.add(this.object3D);
        this.sceneObject = this.scene.children[0];
        this.initializeOrUpdateViewer();
        this.camera = undefined;//main scene camera
        this.axisTriadCamera = undefined;//camera for axis triad scene
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true, // not much difference if enabled
            // clearColor: 0xFFFFFF,
            // clearAlpha: 1,
            logarithmicDepthBuffer: true,
        });
        this.axisTriadRenderer = undefined//renderer for axis triad canvas
        this.controls = undefined;//trackball or orbit control
        this.rayCaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2(); 
    }

    /**
     * initializing the axis triad canvas
     */
    initializeAxisTriadCanvas(){
        this.axisTriadScene = new THREE.Scene();
        this.axisTriadRenderer = new THREE.WebGLRenderer({
            antialias: true, // not much difference if enabled
            // clearColor: 0xFFFFFF,
            // clearAlpha: 1,
            antialias:true,
            logarithmicDepthBuffer: true,
        });
        this.axisTriadRenderer.setSize(this.width/10, this.height/10);
        this.axisTriadRenderer.setPixelRatio(window.devicePixelRatio)
        document.body.appendChild(this.axisTriadRenderer.domElement);
        this.axisTriadRenderer.domElement.setAttribute("id", "inset");

        // camera
        this.axisTriadCamera = new THREE.PerspectiveCamera(50, this.width / this.height, 1, 10000);
        this.axisTriadCamera.up = this.camera.up; // important!
        this.axisTriadCamera.position.z = 5;
        this.axisTriadScene.add(this.axisTriadCamera);
        // axes
        var axes = new THREE.AxesHelper(1);
        this.axisTriadScene.add(axes);
    }

    /**
     * initialize or update the params for perspective and ortho camera 
     */
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
        this.camera.zoom = 55;
        app.addSpotLightInCamera();
        viewer.scene.add(this.camera);
        this.camera.updateProjectionMatrix();
    }

    removeOrthographicCamera(){
        for(let i = 0;i < this.scene.children.length;++i){
            if(this.scene.children[i].name === "orthographic camera"){
                this.scene.remove(this.scene.children[i]);
                break;//optimize
            }
        }
    }

    removePerspectiveCamera(){
        for(let i = 0;i < this.scene.children.length;++i){
            if(this.scene.children[i].name === "perspective camera"){
                this.scene.remove(this.scene.children[i]);
                break;//optimizing
            }
        }
    }

    initializePerspectiveCamera(){
        this.camera = undefined;
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