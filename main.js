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
    const game_content = document.getElementById("game_container");
    const extra_div = document.getElementById("extra_div");
    const canvas = document.getElementById("glcanvas");
    fps_p = document.getElementById("fps_p");
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    tryFixSize(gl);

    canvas.ondblclick = () => {
        requestFullscreen(game_content);
        requestPointerLock(canvas);
    };

    const fullscreenCallback = () => { requestFullscreen(game_content); };
    document.getElementById("fullscreen_btn").onclick = fullscreenCallback;
    key_itriggers["f"] = fullscreenCallback;

    const pointerLockCallback = () => { requestPointerLock(canvas); };
    document.getElementById("pointerlock_btn").onclick = pointerLockCallback;
    key_itriggers["m"] = pointerLockCallback;

    let extra_state = true;
    const hideControlCallback = () => {
        extra_state = !extra_state;
        extra_div.style.display = extra_state ? "block" : "none";
    };
    document.getElementById("hide_btn").onclick = hideControlCallback;
    key_itriggers["h"] = hideControlCallback;

    let easter_state = false;
    const loveEasterCallback = () => {
        easter_state = !easter_state;
        document.getElementById("love_easter").style.display = easter_state ? "block" : "none";
    };
    key_itriggers["n"] = loveEasterCallback;

    let debug_toggle_state = false;
    const toggleDebugCallback = () => {
        debug_toggle_state = !debug_toggle_state;
        if (debug_toggle_state) {
            document.getElementById("debug_toggler").style.transform = "rotate(180deg)";
            document.getElementById("debug_control_div").style.display = "inline";
        } else {
            document.getElementById("debug_toggler").style.transform = "";
            document.getElementById("debug_control_div").style.display = "none";
        }
    };
    document.getElementById("debug_toggle_div").onclick = toggleDebugCallback;
    key_itriggers["m"] = toggleDebugCallback;

    load_meshes(obj_paths, () => {
        startGame(gl);
    });

    setupKeyListeners(window);
};