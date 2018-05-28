let game_surface = null;

let u = Math.PI / 2;
let v = Math.PI / 2 + 1;

let view_shift_up = -0.5;
let view_shift_right = 0;

const TURN_SPEED = 0.006;
const MAX_LAT = Math.PI * 3 / 7;

let lat_velocity = 0;
let lon_velocity = 0;

let view_lat = -0.20;
let view_lon = Math.PI / 2;

const MAX_VELOCITY = 10.0;
let stright_velocity = 0;
let side_velocity = 0;


let h = 1; // HACK

function init_game_surface() {
    // const inner = false;
    const inner = true;
    // game_surface = new Thor(8, 5, inner);
    // game_surface = new Sphere(8, inner);
    game_surface = new Plane(8, inner);
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

    move_head(lat_velocity * deltaTime, lon_velocity * deltaTime);

    if (!isMobile()) {
        stright_velocity = 0;
        side_velocity = 0;
        lon_velocity = 0;
        lat_velocity = 0;
    }
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
    view_lat += TURN_SPEED * dy;

    if (view_lat > MAX_LAT) {
        view_lat = MAX_LAT;
    } else if (view_lat < -MAX_LAT) {
        view_lat = -MAX_LAT;
    }
    view_lon += TURN_SPEED * dx;
}

function player_xyz() {

    return vec(game_surface.xyz(u, v));
}

function player_view() {
    const forward = vec(game_surface.du(u, v));
    const up = vec(game_surface.nxyz(u, v));
    const right = vec(game_surface.dv(u, v));

    const viewMatrix = mat4.fromValues(
        ...right, 0,
        ...up, 0,
        ...forward, 0,
        0, 0, 0, 1);
    const view_shift = player_xyz();

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

    vec3.scaleAndAdd(view_shift, view_shift, up, view_shift_up);
    const new_right = [viewMatrix[0], viewMatrix[4], viewMatrix[8]];
    vec3.scaleAndAdd(view_shift, view_shift, new_right, view_shift_right);

    mat4.translate(
        viewMatrix,
        viewMatrix,
        view_shift);

    return viewMatrix;
}

function Player(key_triggers) {
    if (isMobile()) {
        left_joystick.on("move", (evt, move) => {
            stright_velocity = MAX_VELOCITY * Math.sin(move.angle.radian) * move.distance / 50;
            side_velocity = -MAX_VELOCITY * Math.cos(move.angle.radian) * move.distance / 50;
        });
        left_joystick.on("end", () => {
            stright_velocity = 0;
            side_velocity = 0;
        });
        right_joystick.on("move", (evt, move) => {
            lon_velocity = -6 * Math.sin(move.angle.radian) * move.distance;
            lat_velocity = 6 * Math.cos(move.angle.radian) * move.distance;
        });
        right_joystick.on("end", () => {
            lon_velocity = 0;
            lat_velocity = 0;
        });
    }
    else {
        key_triggers['w'] = forward_start;
        key_triggers['s'] = back_start;
        key_triggers['a'] = left_start;
        key_triggers['d'] = right_start;

        window.addEventListener("mousemove", (event) => {
            lon_velocity = 20 * event.movementY;
            lat_velocity = 20 * event.movementX;
        }, false);
    }
}
