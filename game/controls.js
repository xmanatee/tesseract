let key_triggers = {};

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

// function glMouseMoveListener(event) {
//     view_lat += TURN_SPEED * event.movementY;
//     if (view_lat > MAX_LAT) {
//         view_lat = MAX_LAT;
//     } else if (view_lat < -MAX_LAT) {
//         view_lat = -MAX_LAT;
//     }
//     view_lon += TURN_SPEED * event.movementX;
// }

let left_joystick = null;
let right_joystick = null;

function setupKeyListeners(window) {
    if (isMobile()) {
        left_joystick = nipplejs.create({
            zone: document.getElementById('left_joystick'),
            color: 'red'
        });
        right_joystick = nipplejs.create({
            zone: document.getElementById('right_joystick'),
            color: 'blue'
        });
    }
    else {
        document.getElementById('left_joystick').style.display = "none";
        document.getElementById('right_joystick').style.display = "none";

        // window.addEventListener("keypress", glKeyPressedListener, false);
        window.addEventListener("keydown", glKeyDownListener, false);
        window.addEventListener("keyup", glKeyUpListener, false);
        // window.addEventListener("mousemove", glMouseMoveListener, false)
    }

}
