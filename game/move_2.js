let game_surface = null;

let u = 0;
let v = Math.PI / 2;

let view_height = -0.3;

const MAX_TURN = 0.005;
const MAX_LAT = 1;
let view_lat = 0;
let view_lon = Math.PI / 2;

const MAX_VELOCITY = 5.0;
let stright_velocity = 0;
let side_velocity = 0;


let h = 1; // HACK

function init_game_surface() {
    const inner = false;
    game_surface = new Thor(20, 4, inner);
    // game_surface = new Sphere(20, inner);
    h = 1;
    if (!inner) {
        h = -1;
    }

}

function move(deltaTime) {
    const u_velocity = game_surface.du_len(u, v);
    const v_velocity = game_surface.dv_len(u, v);

    u += (Math.cos(view_lon) * stright_velocity + Math.sin(view_lon) * side_velocity) / u_velocity * deltaTime;
    v += (-Math.sin(view_lon) * stright_velocity + Math.cos(view_lon) * side_velocity) / v_velocity * deltaTime * h;
    stright_velocity = 0;
    side_velocity = 0;
}
function forward_start() {
    stright_velocity = MAX_VELOCITY;
}
function back_start() {
    stright_velocity = -MAX_VELOCITY;
}
function left_start() {
    side_velocity = MAX_VELOCITY;
}
function right_start() {
    side_velocity = - MAX_VELOCITY;
}
function move_head(dx, dy) {
    view_lat += MAX_TURN * dy;

    if (view_lat > MAX_LAT) {
        view_lat = MAX_LAT;
    } else if (view_lat < -MAX_LAT) {
        view_lat = -MAX_LAT;
    }
    view_lon += MAX_TURN * dx;
}

function player_xyz() {

    return vec(game_surface.xyz(u, v));
}

function player_view() {
    const forward = vec(game_surface.du(u, v));
    const up = vec(game_surface.nxyz(u, v));
    let right = vec(game_surface.dv(u, v));

    const viewMatrix = mat4.fromValues(
        ...right, 0,
        ...up, 0,
        ...forward, 0,
        0, 0, 0, 1);

    mat4.transpose(viewMatrix, viewMatrix);
    mat4.rotate(
        viewMatrix,
        viewMatrix,
        view_lat,
        right);
    mat4.rotate(
        viewMatrix,
        viewMatrix,
        view_lon,
        up);
    // right = vec({x: viewMatrix[0], y: viewMatrix[1], z: viewMatrix[2],});

    const h_vec = up;
    vec3.scaleAndAdd(h_vec, player_xyz(), up, view_height);
    mat4.translate(
        viewMatrix,
        viewMatrix,
        h_vec);

    return viewMatrix;
}

key_triggers['W'] = forward_start;
key_triggers['S'] = back_start;
key_triggers['A'] = left_start;
key_triggers['D'] = right_start;

window.addEventListener("mousemove", (event) => {
    move_head(event.movementX, event.movementY);
}, false);
