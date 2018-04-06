function fixSize(canvas, gl) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}



function requestFullscreen(canvas) {
    canvas.requestFullScreen = canvas.requestFullScreen || canvas.webkitRequestFullScreen || canvas.mozRequestFullScreen;
    canvas.requestFullScreen();

    canvas.requestPointerLock = canvas.requestPointerLock || canvas.webkitRequestPointerLock || canvas.mozRequestPointerLock;
    canvas.requestPointerLock();
}

let fps_p = null;

window.onload = function() {
    const canvas = document.getElementById("glcanvas");
    fps_p = document.getElementById("fps_p");
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    fixSize(canvas, gl);
    canvas.ondblclick = () => { requestFullscreen(canvas); };
    window.onresize = () => { fixSize(canvas, gl); };

    load_meshes(obj_paths, () => {
        startGame(gl);
    });

    setupKeyListeners(window);
};