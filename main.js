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

    // let mesh = mesh_from_obj(stickman_obj_src);
    // console.log(mesh);
    // let scaled_mesh = scale_obj_positions(mesh);
    // console.log(mesh);
    // console.log(scaled_mesh);
    // console.log(buildCubeMesh({cube_half_side: 0.5,}));
    // load_file("objs/rose.obj", (text) => {
    //     console.log("size: ", text.length);
    // });


    const canvas = document.getElementById("glcanvas");
    fps_p = document.getElementById("fps_p");

    const gl = canvas.getContext("webgl2");

    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    fixSize(canvas, gl);

    window.onresize = () => {fixSize(canvas, gl);};
    canvas.ondblclick = () => {requestFullscreen(canvas);};

    load_meshes(obj_paths, () => {
        // console.log(scale_obj_positions(mesh_from_obj(obj_meshes.flash)));
        startScene(gl);
    });

    setupKeyListeners(window);
};