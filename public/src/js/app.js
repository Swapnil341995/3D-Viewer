let viewer = new Viewer();

const app = {
  transformControls: null,
  moveWings: false,
  createCube: function (length = 10, width = 10, height = 10, color = 0x0000ff) {
    const geometry = new THREE.BoxGeometry(length, width, height);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  },
  /**
   * @param {data} vertices 
   * @returns pos, norm, uv
   */
  prepareDataFromSamples: function (vertices) {
    const positions = [];
    const normals = [];
    const uvs = [];
    for (const vertex of vertices) {
      positions.push(...vertex.pos);
      normals.push(...vertex.norm);
      uvs.push(...vertex.uv);
    }
    return { positions, normals, uvs };
  },
  /** creating a butterfly */ 
  createButterfly: function () {
    //ADD this to animate
    // if(viewer.scene.children[0].geometry.attributes.position.array[7] >= 9 || viewer.scene.children[0].geometry.attributes.position.array[7] <= -3){
    //     viewer.scene.children[0].geometry.attributes.position.array[7] *= 0.05;
    //     viewer.scene.children[0].geometry.attributes.position.array[10] *= 0.05;
    // }
    // else{
    //     viewer.scene.children[0].geometry.attributes.position.array[7] +=1;
    //     viewer.scene.children[0].geometry.attributes.position.array[10] +=1;
    // }
    // viewer.scene.children[0].geometry.attributes.position.needsUpdate = true
    this.moveWings = true;
    const geometry = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const positions = [];
    for (const vertex of sample.butterflyVertices) {
      positions.push(...vertex.pos);
    }
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(positions),
        positionNumComponents
      )
    );
    geometry.setIndex([0, 1, 2, 0, 1, 3]);
    const materialProperties = this.addDefaultMaterialProperties();
    const material = new THREE.MeshBasicMaterial(materialProperties);
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  },
  //Created from sample-geometry
  createCustomGeometryFromSample: function (vertices) {
    const { positions, normals, uvs } = this.prepareDataFromSamples(vertices);
    const geometry = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(positions),
        positionNumComponents
      )
    );
    geometry.setAttribute(
      "normal",
      new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents)
    );
    geometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents)
    );
    geometry.setIndex([
      0, 1, 2, 2, 1, 3, 4, 5, 6, 6, 5, 7, 8, 9, 10, 10, 9, 11, 12, 13, 14, 14,
      13, 15, 16, 17, 18, 18, 17, 19, 20, 21, 22, 22, 21, 23,
    ]);
    return geometry;
  },
  createMeshFromGeometry: function (vertices) {
    const geometry = this.createCustomGeometryFromSample(vertices);
    const materialProperties = this.addDefaultMaterialProperties();
    const material = new THREE.MeshBasicMaterial(materialProperties);
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  },
  addOrbitControls: function () {
    viewer.orbitControls = new THREE.OrbitControls(
      viewer.camera,
      viewer.renderer.domElement
    );
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
  toggleMovementOfWings: function () {
    if (this.moveWings) {
      this.moveWings = false;
    } else {
      this.moveWings = true;
    }
  },
  loadGltf: function () {
    const loader = new THREE.GLTFLoader();
    // Load a glTF and glb resource
    loader.load(
      // resource URL
      "./assets/gltf/scifi-helmet/SciFiHelmet.gltf",
      // "./assets/glb/BrainStem.glb",
      // "./assets/gltf/toycar/ToyCar.gltf",
      // "./assets/gltf/duck/Duck.glb",
      // called when the resource is loaded
      function (gltf) {
        viewer.sceneObject.add(gltf.scene);

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
  loadOBJ: function(){
    const loader = new THREE.OBJLoader();
    loader.load(
      // './assets/obj/LibertyStatue/LibertStatue.obj',
      // './assets/obj/maya/maya.obj',
      // './assets/obj/PantherBoss/PAN.obj',
      // './assets/obj/batman/batman.obj',
      './assets/obj/DarkSiderGun/GUN_OBJ.obj',
      function ( object ) {
        viewer.sceneObject.add( object );
      },
      // called when loading is in progresses
      function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      },
      // called when loading has errors
      function ( error ) {
        console.log( 'An error happened' );
      }
    )
  },
  addAmbientLight: function(intensity = 0.5){
    const light = new THREE.AmbientLight( 0x404040 );
    light.intensity = intensity;
    viewer.scene.add( light );
  },
  addSpotLight: function(){
    const light = new THREE.SpotLight( 0x404040 );
    light.intensity = 3;
    // light.target = viewer.scene.position;
    // light.position.x = 60;
    // light.position.y = 60;
    // light.position.z = 60;
    return light
  },
  addSpotLightInCamera: function(){
    const spotLight = this.addSpotLight();
    spotLight.position.set(0, 0, 1);
    spotLight.target = viewer.camera;
    viewer.camera.add(spotLight);
    viewer.camera.updateProjectionMatrix();
  },
  displayBoundingBox: function(){
    const box = new THREE.BoxHelper( viewer.sceneObject, 0x66FF33 );
    viewer.scene.add(box);
  },
  /**
   * 
   * @param {3d object or mesh or group} object 
   * @returns proper bounding box
   */
  getProperBbox: function(object){
    let bbox = new THREE.Box3();
    object.traverse(function(obj){
      if(obj instanceof THREE.Mesh){
        obj.geometry.computeBoundingBox();
        bbox.max.x = obj.geometry.boundingBox.max.x > bbox.max.x ? obj.geometry.boundingBox.max.x : bbox.max.x;
        bbox.max.y = obj.geometry.boundingBox.max.y > bbox.max.y ? obj.geometry.boundingBox.max.y : bbox.max.y;
        bbox.max.z = obj.geometry.boundingBox.max.z > bbox.max.z ? obj.geometry.boundingBox.max.z : bbox.max.z;
        
        bbox.min.x = obj.geometry.boundingBox.min.x < bbox.min.x ? obj.geometry.boundingBox.min.x : bbox.min.x;
        bbox.min.y = obj.geometry.boundingBox.min.y < bbox.min.y ? obj.geometry.boundingBox.min.y : bbox.min.y;
        bbox.min.z = obj.geometry.boundingBox.min.z < bbox.min.z ? obj.geometry.boundingBox.min.z : bbox.min.z;
      }
    });
    return bbox
  },
  getDimensions: function(){
    let bbox = this.getProperBbox(viewer.sceneObject);
    let dim_x = bbox.max.x - bbox.min.x; 
    let dim_y = bbox.max.y - bbox.min.y; 
    let dim_z = bbox.max.z - bbox.min.z;
    return { dim_x, dim_y, dim_z }; 
  },
  alignCameraWithBbox: function(){
    const bbox = this.getProperBbox(viewer.sceneObject);
    // const vect = new THREE.Vector3();
    // bbox.getCenter(vect);
    let x = bbox.min.x + (bbox.max.x - bbox.min.x)/2;
    let y = bbox.min.y + (bbox.max.y - bbox.min.y)/2;
    let z = bbox.min.z + (bbox.max.z - bbox.min.z)/2;
    viewer.movePerspectiveCamera(x , y - (y * 0.9) , z - (z * 2) );
    viewer.camera.lookAt(viewer.sceneObject);
    viewer.camera.updateProjectionMatrix();
  },
  setPerspectiveCameraZoomLimit: function(){
    if(viewer.sceneObject){
      let boundingBox = new THREE.Box3().setFromObject(viewer.sceneObject);
      // let boundingBox = viewer.sceneObject.getBoundingBox();
      let minDist = viewer.camera.position.distanceTo(boundingBox.min);
      let minScaleFactor = minDist / 12;
      viewer.orbitControls.minDistance = minScaleFactor;
      let maxDist = viewer.camera.position.distanceTo(boundingBox.max);
      let maxScaleFactor = maxDist * 10;
      viewer.orbitControls.maxDistance = maxScaleFactor;
    }
  },
  getBoundingBoxCenter: function () {
    let bbox = new THREE.Box3().setFromObject(viewer.sceneObject);
    let bboxMaxCenter = new THREE.Vector3((bbox.max.x + bbox.min.x)/2, (bbox.max.y + bbox.min.y)/2, (bbox.max.z + bbox.min.z)/2);
    return bboxMaxCenter;
  },
  updateOrbitControlsTarget: function(){
    viewer.orbitControls.target = this.getBoundingBoxCenter()
  },
  addTransformControls: function(){
    app.transformControls = new THREE.TransformControls(viewer.camera, viewer.renderer.domElement);
    app.transformControls.attach(viewer.sceneObject);
    viewer.scene.add(app.transformControls);
  },
  removeTransformControls: function(){
    app.transformControls.detach();
  }
};

const events = {
  onWindowResize: function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    viewer.camera.aspect = width / height;
    viewer.renderer.setSize(width, height);
    viewer.camera.updateProjectionMatrix();
  },
};

function animate() {
  requestAnimationFrame(animate);
  if (viewer.orbitControls) {
    viewer.orbitControls.update();
  }
  if (app.moveWings) {
    if (
      viewer.scene.children[0].geometry.attributes.position.array[7] >= 9 ||
      viewer.scene.children[0].geometry.attributes.position.array[7] <= -3
    ) {
      viewer.scene.children[0].geometry.attributes.position.array[7] *= 0.05;
      viewer.scene.children[0].geometry.attributes.position.array[10] *= 0.05;
    } else {
      viewer.scene.children[0].geometry.attributes.position.array[7] += 1;
      viewer.scene.children[0].geometry.attributes.position.array[10] += 1;
    }
    viewer.scene.children[0].geometry.attributes.position.needsUpdate = true;
  }

  viewer.renderer.render(viewer.scene, viewer.camera);
}
