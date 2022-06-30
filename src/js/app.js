let viewer = new Viewer();

const app = {
  identityMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  raycastObject: undefined,
  verticesCount: null,
  trianglesCount: null,
  transformControls: null,
  INTERSECTED: null,
  isPartSelected: null,
  partNames: [],
  moveWings: false,
  rotateSceneObj: true,
  createCube: function (length = 10,width = 10,height = 10,color = 0x0000ff) {
    const geometry = new THREE.BoxGeometry(length, width, height);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  },

  addOrbitControls: function () {
    if(viewer.controls === undefined){
      viewer.controls = new THREE.OrbitControls(
        viewer.camera,
        viewer.renderer.domElement
      );
    }
  },

  addTrackballControls: function () {
    if(viewer.controls === undefined){
      viewer.controls = new THREE.TrackballControls(
        viewer.camera,
        viewer.renderer.domElement
      );
    }
    viewer.controls.rotateSpeed = 5;
  },

  initializeControls: function(){
    //starting the model viewer application with the orbit controls 
    this.addOrbitControls()
    // this.addTrackballControls();
  },

  createTextureLoader: function () {
    const textureLoader = new THREE.TextureLoader();
    return textureLoader;
  },

  addDefaultMaterialProperties: function () {
    const loader = this.createTextureLoader();
    const texture = loader.load(
      "https://threejs.org/manual/examples/resources/images/star.png"
    );
    const defaultMaterial = {
      color: 0xffff00,
      wireframe: false,
      side: THREE.DoubleSide,
      map: texture,
    };
    return defaultMaterial;
  },

  moveMeshPosition: function (mesh, objPositions) {
    mesh.position.x = objPositions.x;
    mesh.position.y = objPositions.y;
    mesh.position.z = objPositions.z;
  },

  loadGltf: function () {
    const loader = new THREE.GLTFLoader();
    // Load a glTF and glb resource
    loader.load(
      // resource URL
      // "./src/assets/gltf/scifi-helmet/SciFiHelmet.gltf",
      "./src/assets/glb/BrainStem.glb",
      // "./assets/glb/FormalShoe.glb",
      // "./assets/gltf/toycar/ToyCar.gltf",
      // "./assets/gltf/duck/Duck.glb",
      // "./assets/gltf/boom-box-with-axes/BoomBoxWithAxes.gltf",
      // called when the resource is loaded
      function (gltf) {
        viewer.sceneObject.add(gltf.scene);
        app.afterSceneLoadComplete();
        // gltf.animations; // Array<THREE.AnimationClip>
        // gltf.scene; // THREE.Group
        // gltf.scenes; // Array<THREE.Group>
        // gltf.cameras; // Array<THREE.Camera>
        // gltf.asset; // Object
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );
  },

  loadOBJ: function () {
    const loader = new THREE.OBJLoader();
    loader.load(
      // './assets/obj/LibertyStatue/LibertStatue.obj',
      // './assets/obj/maya/maya.obj',
      // './assets/obj/PantherBoss/PAN.obj',
      "./assets/obj/batman/batman.obj",
      // './assets/obj/DarkSiderGun/GUN_OBJ.obj',
      function (object) {
        viewer.sceneObject.add(object);
        app.afterSceneLoadComplete();
      },
      // called when loading is in progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );
  },
  
  addOrUpdateAmbientLight: function (intensity = 0.5) {
    const ambLight = viewer.scene.getObjectByName("ambient_light");
    if(ambLight === undefined){
      const light = new THREE.AmbientLight(0x404040);
      light.name = "ambient_light";
      light.intensity = intensity;
      viewer.scene.add(light);
    }
    else{
      ambLight.intensity = intensity;
    }
  },

  addSpotLight: function () {
    const light = new THREE.SpotLight(0x404040);
    light.intensity = 2;
    return light;
  },

  addSpotLightInCamera: function () {
    const spotLight = this.addSpotLight();
    spotLight.position.set(0, 0, 1);
    spotLight.target = viewer.camera;
    viewer.camera.add(spotLight);
    viewer.camera.updateProjectionMatrix();
  },

  showOrHideBoundingBox: function (boolBbox) {
    let box;
    if (boolBbox) {
      box = new THREE.BoxHelper(viewer.sceneObject, 0x66ff33);
      box.name = "bboxHelper";
      viewer.scene.add(box);
    } else {
      const box = viewer.scene.getObjectByName("bboxHelper");
      viewer.scene.remove(box);
    }
  },

  /**
   *
   * @param {3d object or mesh or group} object
   * @returns proper bounding box
   */
  getProperBbox: function (object) {
    let bbox = new THREE.Box3();
    object.traverse(function (obj) {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.computeBoundingBox();
        bbox.max.x =
          obj.geometry.boundingBox.max.x > bbox.max.x
            ? obj.geometry.boundingBox.max.x
            : bbox.max.x;
        bbox.max.y =
          obj.geometry.boundingBox.max.y > bbox.max.y
            ? obj.geometry.boundingBox.max.y
            : bbox.max.y;
        bbox.max.z =
          obj.geometry.boundingBox.max.z > bbox.max.z
            ? obj.geometry.boundingBox.max.z
            : bbox.max.z;

        bbox.min.x =
          obj.geometry.boundingBox.min.x < bbox.min.x
            ? obj.geometry.boundingBox.min.x
            : bbox.min.x;
        bbox.min.y =
          obj.geometry.boundingBox.min.y < bbox.min.y
            ? obj.geometry.boundingBox.min.y
            : bbox.min.y;
        bbox.min.z =
          obj.geometry.boundingBox.min.z < bbox.min.z
            ? obj.geometry.boundingBox.min.z
            : bbox.min.z;
      }
    });
    return bbox;
  },

  getDimensions: function () {
    let bbox = this.getProperBbox(viewer.sceneObject);
    let dim_x = bbox.max.x - bbox.min.x;
    let dim_y = bbox.max.y - bbox.min.y;
    let dim_z = bbox.max.z - bbox.min.z;
    return { dim_x, dim_y, dim_z };
  },

  alignCameraWithBbox: function () {
    const bbox = this.getProperBbox(viewer.sceneObject);
    // const vect = new THREE.Vector3();
    // bbox.getCenter(vect);
    let x = bbox.min.x + (bbox.max.x - bbox.min.x) / 2;
    let y = bbox.min.y + (bbox.max.y - bbox.min.y) / 2;
    let z = bbox.min.z + (bbox.max.z - bbox.min.z) / 2;
    viewer.movePerspectiveCamera(x, y - y * 0.9, z - z * 2);
    viewer.camera.lookAt(viewer.sceneObject);
    viewer.camera.updateProjectionMatrix();
  },
  
  setPerspectiveCameraZoomLimit: function () {
    if (viewer.sceneObject) {
      let boundingBox = new THREE.Box3().setFromObject(viewer.sceneObject);
      // let boundingBox = viewer.sceneObject.getBoundingBox();
      let minDist = viewer.camera.position.distanceTo(boundingBox.min);
      let minScaleFactor = minDist / 12;
      viewer.controls.minDistance = minScaleFactor;
      let maxDist = viewer.camera.position.distanceTo(boundingBox.max);
      let maxScaleFactor = maxDist * 10;
      viewer.controls.maxDistance = maxScaleFactor;
    }
  },

  getBoundingBoxCenter: function () {
    let bbox = new THREE.Box3().setFromObject(viewer.sceneObject);
    let bboxMaxCenter = new THREE.Vector3(
      (bbox.max.x + bbox.min.x) / 2,
      (bbox.max.y + bbox.min.y) / 2,
      (bbox.max.z + bbox.min.z) / 2
    );
    return bboxMaxCenter;
  },

  updateControlsTarget: function () {
    viewer.controls.target = this.getBoundingBoxCenter();
  },

  changeControls: function(){
    if(viewer.controls.enabled){
      if(viewer.controls.type === "OrbitControls"){
        viewer.controls.dispose();
        viewer.controls = undefined;
        this.addTrackballControls();
        this.updateControlsTarget();
      }
      else if(viewer.controls.type === "TrackballControls"){
        viewer.controls.dispose();
        viewer.controls = undefined;
        this.addOrbitControls();
        this.updateControlsTarget();
      }
    }
  },

  addTransformControls: function () {
    app.transformControls = new THREE.TransformControls(
      viewer.camera,
      viewer.renderer.domElement
    );
    app.transformControls.attach(viewer.sceneObject);
    viewer.scene.add(app.transformControls);
  },

  removeTransformControls: function () {
    app.transformControls.detach();
  },

  homePosition: function () {
    //calculate bounding box of the scene object
    const bbox = new THREE.Box3().setFromObject(viewer.sceneObject);
    //get the controls target in the bounding box center
    this.updateControlsTarget();
    //generate matrix4 from the identity array
    const mat = new THREE.Matrix4().fromArray(app.identityMatrix);
    const inverse = new THREE.Matrix4();
    //get inverse of the matrix
    inverse.copy(mat).invert();
    const quaternion = new THREE.Quaternion();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();
    //get pos, quat and scale from the matrix
    inverse.decompose(position, quaternion, scale);
    //set camera position to home
    viewer.camera.position.set(
      position.x,
      position.y + bbox.max.y * 3,
      bbox.max.z + bbox.max.z * 10
    );
  },

  getVerticesAndTrianglesCount: function () {
    (app.verticesCount = 0), (app.trianglesCount = 0);
    viewer.sceneObject.traverse((object) => {
      if (object.isMesh) {
        const geometry = object.geometry;
        app.verticesCount += geometry.attributes.position.count;
        if (geometry.index !== null) {
          app.trianglesCount += geometry.index.count / 3;
        } else {
          app.trianglesCount += geometry.attributes.position.count / 3;
        }
      }
    });
  },

  /**
   * Turns model into wireframe mode
   */
  turnModelToWireframe: function (boolWireframe) {
    if (boolWireframe) {
      viewer.sceneObject.traverse((obj) => {
        if (obj.isMesh) {
          obj.material.wireframe = true;
        }
      });
    } else {
      viewer.sceneObject.traverse((obj) => {
        if (obj.isMesh) {
          obj.material.wireframe = false;
        }
      });
    }
  },

  getPartNames: function () {
    viewer.sceneObject.traverse((obj) => {
      if (obj.isMesh) {
        this.partNames.push(obj.name);
      }
    });
  },

  highlightPart: function (partName) {
    if(partName){
      const highlightObject = viewer.sceneObject.getObjectByName(partName);
      if(!highlightObject.material.userdata){
        highlightObject.material.userdata = {};
        highlightObject.material.userdata.color = highlightObject.material.color.clone();
        highlightObject.material.color = new THREE.Color(0xff007f).clone();
      }
    }
  },

  removeHighlight: function (partName) {
    if(partName){
      const highlightObject = viewer.sceneObject.getObjectByName(partName);
      highlightObject.material.color = new THREE.Color(
        highlightObject.material.userdata?.color
      );
      highlightObject.material.userdata = undefined;
    }
  },

  highlightObjectFromRaycaster: function () {
    // update the picking ray with the camera and pointer position
    viewer.rayCaster.setFromCamera(viewer.pointer, viewer.camera);

    // calculate objects intersecting the picking ray
	  const intersects = viewer.rayCaster.intersectObjects( viewer.sceneObject.children, true );
    
    if ( intersects.length > 0 ) {

      if ( app.INTERSECTED != intersects[ 0 ].object ) {

        if ( app.INTERSECTED ){
          app.INTERSECTED.material.emissive.setHex( app.INTERSECTED.currentHex );
          if(!UIconstants.leftDisplay){
            removeHighlightNameFromModelTree(app.INTERSECTED.id);
          }
        } 

        app.INTERSECTED = intersects[ 0 ].object;
        app.INTERSECTED.currentHex = app.INTERSECTED.material.emissive.getHex();
        app.INTERSECTED.material.emissive.setHex( 0x00FFFF );

        if(!UIconstants.leftDisplay){
          highlightModelName(app.INTERSECTED.id);
        }
      }

    } else {

      if ( app.INTERSECTED ) app.INTERSECTED.material.emissive.setHex( app.INTERSECTED.currentHex );

      if(!UIconstants.leftDisplay && app.INTERSECTED){
        removeHighlightNameFromModelTree(app.INTERSECTED.id);
      }
      app.INTERSECTED = null;

    }

    viewer.renderer.render(viewer.scene, viewer.camera);
  },

  /**
   * adding event listener to raycast and highlight objects
   */
  addEventListenerForHighlightObject: function(){
    window.addEventListener("mousemove", events.onPointerMove, false); //for raycaster
  },

  /**
   * remove event listener to highlight objects
   */
  removeEventListenerForHighlightObject: function(){
    window.removeEventListener("mousemove", events.onPointerMove, false); //for raycaster
  },

  addEventForPartSelect: function(){
    window.addEventListener("mousedown", events.onSelectPart, false);
  },

  removeEventForPartSelect: function(){
    window.removeEventListener("mousedown", events.onSelectPart, false);
  },

  updateParentVisbility: function(obj){
    if(obj.type !== "Scene"){
        obj.visible = true;
        this.updateParentVisbility(obj.parent);
    }
  },

  hideAllParts: function(){
    viewer.sceneObject.traverse((obj) => {
      obj.visible = false;
    });
  },

  showAllParts: function(){
    viewer.sceneObject.traverse((obj) => {
      obj.visible = true;
    });
  },

  onModelTreeClickPart: function(obj){
    app.hideAllParts();
    obj.visible = true;
    app.updateParentVisbility(obj.parent);
    app.isPartSelected = true;
  },

  getScreenshot(){
    animate();
    const dataURL = viewer.canvas.toDataURL();
    const lnk = document.createElement('a');
    lnk.href = dataURL;
    lnk.download = 'screenshot';
    lnk.click();
  },

  rotateSceneObject: function(bool_value){
    if(bool_value){
      viewer.sceneObject.rotation.y += 0.005;
    }else{
      viewer.sceneObject.rotation.y += 0;
    }
  },

  /**
   * After completing the model or scene
   */
  afterSceneLoadComplete: function () {
    this.homePosition();
    this.getVerticesAndTrianglesCount();
    this.getPartNames();
  }
};

const events = {
  onWindowResize: function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    viewer.camera.aspect = width / height;
    if(viewer.camera instanceof THREE.OrthographicCamera){
      viewer.camera.left = window.innerWidth / -2;
      viewer.camera.right = window.innerWidth / 2;
      viewer.camera.bottom = window.innerHeight / -2;
      viewer.camera.top = window.innerHeight / 2;
    }
    viewer.renderer.setSize(width, height);
    viewer.camera.updateProjectionMatrix();
  },

  //gets pointer or cursor position, useful for raycasting
  onPointerMove: function (event) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    viewer.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    viewer.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    app.highlightObjectFromRaycaster();

  },

  onSelectPart: function(event){
    if(!app.isPartSelected && app.INTERSECTED){
      app.hideAllParts();
      app.INTERSECTED.visible = true;
      app.updateParentVisbility(app.INTERSECTED.parent);
      app.isPartSelected = true;
      app.removeEventForPartSelect();
    }
  },

  onKeyDownForTransformControls: function(event){
    switch ( event.keyCode ) {

      case 87: // W
        app.transformControls.setMode( 'translate' );
        break;

      case 69: // E
        app.transformControls.setMode( 'rotate' );
        break;

      case 82: // R
        app.transformControls.setMode( 'scale' );
        break;
    }
  }
};

function animate() {
  requestAnimationFrame(animate);
  if (viewer.controls) {
    viewer.controls.update();
  }
  if(app.rotateSceneObj){
    app.rotateSceneObject(app.rotateSceneObj);
  }
  viewer.renderer.render(viewer.scene, viewer.camera);
}
