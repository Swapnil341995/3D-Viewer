const start = {
    init: function(){
        viewer.setSceneBackgroundColor(0xf5f5f5);
        window.addEventListener('resize', events.onWindowResize, false);
        viewer.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(viewer.renderer.domElement);
        viewer.movePerspectiveCamera(30, 30, 30);
        viewer.scene.add(viewer.camera);
        app.initializeControls();
        app.loadGltf();
        app.addOrUpdateAmbientLight(1);
        app.addSpotLightInCamera();
        // app.initializeControls();
        // app.addOrbitControls();
        animate();
    }
}
start.init();