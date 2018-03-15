let u = -7.0;
let v = 0;

const MAX_TURN = 0.003;
const MAX_LAT = 1;
let view_lat = 0;
let view_lon = 0;

const MAX_VELOCITY = 5.0;
let stright_velocity = 0;
let side_velocity = 0;

function move(deltaTime) {
    u += (Math.cos(view_lon) * stright_velocity + Math.sin(view_lon) * side_velocity) * deltaTime;
    v += (-Math.sin(view_lon) * stright_velocity + Math.cos(view_lon) * side_velocity) * deltaTime;
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
    side_velocity = -MAX_VELOCITY;
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
    return [v, 0, u];
}

function player_view() {
    const viewMatrix = mat4.create();
    mat4.rotate(
        viewMatrix,
        viewMatrix,
        view_lon,
        [0, 1, 0]);
    mat4.rotate(
        viewMatrix,
        viewMatrix,
        view_lat,
        [Math.cos(view_lon), 0, Math.sin(view_lon)]);
    mat4.translate(
        viewMatrix,
        viewMatrix,
        player_xyz());
    return viewMatrix;
}

key_triggers['W'] = forward_start;
key_triggers['S'] = back_start;
key_triggers['A'] = left_start;
key_triggers['D'] = right_start;

window.addEventListener("mousemove", (event) => {
    move_head(event.movementX, event.movementY);
}, false);
