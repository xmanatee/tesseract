function initCanvas(canvas) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    function requestFullscreen(){
        if(canvas.webkitRequestFullScreen) {
            canvas.webkitRequestFullScreen();
        }
        else {
            canvas.mozRequestFullScreen();
        }
        // canvas.removeEventListener("click", requestFullscreen);
    }

    canvas.addEventListener("dblclick", requestFullscreen)
}

var fps_p = null;

window.onload = function() {
    const canvas = document.getElementById("glcanvas");
    fps_p = document.getElementById("fps_p");

    initCanvas(canvas);

    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    // console.log("Lalaka");
    draw(gl);

    setupKeyListeners(window);
};