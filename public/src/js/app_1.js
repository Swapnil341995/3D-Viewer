//Scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const createCube = () => {
    //geometry
    const geometry = new THREE.BoxGeometry();

    //material
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    //mesh
    const cube = new THREE.Mesh(geometry, material);

    return cube;
}
const createCircles = (radius, tube, radialSeg, tubularSeg, color) => {
    const geometry = new THREE.TorusGeometry(radius, tube, radialSeg, tubularSeg)
    const material = new THREE.MeshBasicMaterial({ color: color, wireframe: false })
    const torus = new THREE.Mesh( geometry, material );
    return torus
}

const createSphere = (radius, widthSeg, heightSeg, color) => {
    const geometry = new THREE.SphereGeometry(radius, widthSeg, heightSeg);
    const material = new THREE.MeshBasicMaterial({ color: color, wireframe: false });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

const createSaturn = () => {
    const object3D = new THREE.Object3D();
    const torus1 = createCircles(18, 2, 2, 100, 0xffff00)
    object3D.add(torus1);
    const torus2 = createCircles(12, 2, 2, 100, 0xffbf00)
    object3D.add(torus2);
    const sphere = createSphere(9, 85, 5, 0x4e4e00);
    object3D.add(sphere);
    object3D.rotation.x = 5
    object3D.rotation.y = 0.5
    return object3D;
}

// let cube = createCube()

// constants.scene.add(cube);
const saturn = createSaturn()
camera.position.z = 55;

let ADD = 0.05;
constants.scene.add(saturn);

//performing animation
function animate() {
  requestAnimationFrame(animate);
//   cube.position.x += ADD
//   cube.position.y += ADD
//   cube.position.z += ADD

//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.1;
//   cube.rotation.z += 0.01;
saturn.position.y += ADD;

if(saturn.position.y >= 5 || saturn.position.y <= -5 ){
    ADD *= -1;
}
// else{
//     cube.position.x -= ADD
// }


  renderer.render(constants.scene, camera);
}

animate();
