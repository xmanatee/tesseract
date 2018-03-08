var key_triggers = {};
key_triggers['w'] = function () {
    stright_velocity = 1;
};
key_triggers['s'] = function () {
    stright_velocity = -1;
};
key_triggers['a'] = function () {
    side_velocity = 1;

};
key_triggers['d'] = function () {
    side_velocity = -1;
};

function glKeyPressedListener(event){
    // console.log("lal", event);
    event = event || window.event;
    var key = event.keyCode || event.which || event.key;
    key_triggers[key]();
}

var keys = new Set();
function glKeyDownListener(event) {
    // console.log("lal", event);
    event = event || window.event;
    var key = event.key || event.which || event.key;
    keys.add(key);
}

function glKeyUpListener(event) {
    // console.log("lal", event);
    event = event || window.event;
    var key = event.key || event.which || event.key;
    keys.delete(key);
}

function checkKeys() {
    keys.forEach(key => {
        // console.log("l", key);
        // console.log(KeypressFunctions);
        if (key in key_triggers) {
            key_triggers[key]();
        }
    })
}
