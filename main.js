function tryFixSize(gl) {
    // const width = gl.canvas.clientWidth;
    // const height = gl.canvas.clientHeight;

    // const realToCSSPixels = window.devicePixelRatio;
    // const width  = Math.floor(gl.canvas.clientWidth  * realToCSSPixels);
    // const height = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (gl.canvas.width !== width || gl.canvas.height !== height) {
        gl.canvas.width = width;
        gl.canvas.height = height;
    }
}



function requestFullscreen(canvas) {
    canvas.requestFullScreen = canvas.requestFullScreen || canvas.webkitRequestFullScreen || canvas.mozRequestFullScreen;
    canvas.requestFullScreen();
}

function requestPointerLock(canvas) {
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

    tryFixSize(gl);
    canvas.ondblclick = () => { requestFullscreen(canvas); requestPointerLock(canvas); };
    document.getElementById("pointerlock_btn").onclick = () => { requestPointerLock(canvas); };

    load_meshes(obj_paths, () => {
        startGame(gl);
    });

    setupKeyListeners(window);
};