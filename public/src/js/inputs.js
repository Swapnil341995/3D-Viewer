// const viewer = new Viewer();
// viewer.scene.add(viewer.camera);
// const sceneObject = viewer.scene.children[0]; 
viewer.setSceneBackgroundColor(0xf5f5f5);
window.addEventListener('resize', events.onWindowResize, false);
viewer.renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(viewer.renderer.domElement);
viewer.movePerspectiveCamera(30, 30, 30);
viewer.scene.add(viewer.camera);
// viewer.sceneObject.add(app.createCube());
// app.loadOBJ();
app.loadGltf();
app.addAmbientLight();
app.addSpotLightInCamera();
// app.displayBoundingBox();
// viewer.scene.add(viewer.sceneObject.add(app.createCube(50, 8, 2, 0xffbf00)));
// viewer.scene.add(app.createMeshFromGeometry(sample.vertices));
// viewer.scene.add(app.createButterfly());
app.addOrbitControls();
animate();