let key_triggers = {};
key_triggers['w'] = function () {
    stright_velocity = MAX_VELOCITY;
};
key_triggers['s'] = function () {
    stright_velocity = -MAX_VELOCITY;
};
key_triggers['a'] = function () {
    side_velocity = MAX_VELOCITY;
};
key_triggers['d'] = function () {
    side_velocity = -MAX_VELOCITY;
};

// function glKeyPressedListener(event){
//     event = event || window.event;
//     let key = event.keyCode || event.which || event.key;
//     key_triggers[key]();
// }

let keys = new Set();
function glKeyDownListener(event) {
    event = event || window.event;
    let key = event.key || event.which || event.key;
    keys.add(key);
}

function glKeyUpListener(event) {
    event = event || window.event;
    let key = event.key || event.which || event.key;
    keys.delete(key);
}

function checkKeys() {
    keys.forEach(key => {
        if (key in key_triggers) {
            key_triggers[key]();
        }
    })
}

function glMouseMoveListener(event) {
    view_lat += MAX_TURN * event.movementY;
    if (view_lat > MAX_LAT) {
        view_lat = MAX_LAT;
    } else if (view_lat < -MAX_LAT) {
        view_lat = -MAX_LAT;
    }
    view_lon += MAX_TURN * event.movementX;
}

function setupKeyListeners(window) {
    // window.addEventListener("keypress", glKeyPressedListener, false);
    window.addEventListener("keydown", glKeyDownListener, false);
    window.addEventListener("keyup", glKeyUpListener, false);
    window.addEventListener("mousemove", glMouseMoveListener, false)
}
