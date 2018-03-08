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

window.onload = function() {
    const canvas = document.getElementById("glcanvas");

    initCanvas(canvas);

    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    // console.log("Lalaka");
    draw(gl);
    // window.addEventListener("keypress", glKeyPressedListener, false);
    window.addEventListener("keydown", glKeyDownListener, false);
    window.addEventListener("keyup", glKeyUpListener, false);
};