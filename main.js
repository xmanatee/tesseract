function fixSize(canvas, gl) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    gl.viewport(0, 0, canvas.width, canvas.height);

}

function requestFullscreen(canvas) {
    if(canvas.webkitRequestFullScreen) {
        canvas.webkitRequestFullScreen();
    }
    else {
        canvas.mozRequestFullScreen();
    }
}

let fps_p = null;

window.onload = function() {
    const canvas = document.getElementById("glcanvas");
    fps_p = document.getElementById("fps_p");

    const gl = canvas.getContext("webgl2");

    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    fixSize(canvas, gl);
    window.onresize = () => {
        fixSize(canvas, gl);
    };
    // canvas.addEventListener("dblclick", requestFullscreen);

    canvas.ondblclick = () => {
        requestFullscreen(canvas)
    };


    draw(gl);

    setupKeyListeners(window);
};