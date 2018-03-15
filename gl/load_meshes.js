const obj_meshes = {};

function load_meshes(obj_paths, callback) {
    for (let i = 0; i < obj_paths.length; ++i) {
        const path = obj_paths[i];
        const start = path.lastIndexOf("/");
        const stop = path.lastIndexOf(".");
        const name = path.substring(start + 1, stop);

        load_file(obj_paths[i], (src) => {
            obj_meshes[name] = src;
            if (Object.keys(obj_meshes).length === obj_paths.length) {
                callback();
            }
        })
    }
}

const obj_paths = [
    // "objs/bb8.obj",
    // "objs/bike.obj", // too big
    // "objs/bugatti.obj", // too big
    // "objs/bunny2.obj",
    "objs/cerberus.obj",
    // "objs/colt.obj",
    // "objs/darth_vader.obj", //too big
    // "objs/death_star.obj", // too big
    "objs/die.obj",
    // "objs/dog.obj",
    // "objs/female.obj",
    "objs/flash.obj",
    // "objs/heart.obj",
    // "objs/helicopter.obj",
    // "objs/hp.obj", // too big
    // "objs/iron_man.obj", // broken
    // "objs/iron_man_2.obj",
    // "objs/iron_man_3.obj",
    // "objs/kodama.obj", // broken
    // "objs/lamp.obj",
    // "objs/mp412.obj",
    "objs/naruto.obj",
    // "objs/stickman.obj",
    // "objs/suzanne.obj",
    // "objs/suzanne_2.obj",
    // "objs/teapot.obj",
    // "objs/trex.obj",
    // "objs/z3.obj", // too big
];
