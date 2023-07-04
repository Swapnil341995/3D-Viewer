const start = {
    init: function(){
        viewer.setSceneBackgroundColor(0xf5f5f5);
        window.addEventListener('resize', events.onWindowResize, false);
        viewer.renderer.setSize(window.innerWidth, window.innerHeight);
        viewer.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2) );
        document.body.appendChild(viewer.renderer.domElement);
        viewer.initializePerspectiveCamera();
        viewer.scene.add(viewer.camera);
        app.initializeControls();
        app.loadGltf();
        app.addOrUpdateAmbientLight(1);
        animate();
    }
}
start.init();