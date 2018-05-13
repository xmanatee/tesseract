

function read3d(array, id) {
    return [
        array[id],
        array[id + 1],
        array[id + 2],
    ];
}

function read4d(array, id) {
    return [
        array[id],
        array[id + 1],
        array[id + 2],
        array[id + 3],
    ];
}

function to3d(v) {
    return [
        v[0],
        v[1],
        v[2],
    ];
}

function minus4d(v) {
    return [
        -v[0],
        -v[1],
        -v[2],
        -v[3],
    ];
}

function sum3d(v1, v2) {
    return [
        v1[0] + v2[0],
        v1[1] + v2[1],
        v1[2] + v2[2],
    ];
}

function sum4d(v1, v2) {
    return [
        v1[0] + v2[0],
        v1[1] + v2[1],
        v1[2] + v2[2],
        v1[3] + v2[3],
    ];
}

function sub4d(v1, v2) {
    return sum4d(v1, minus4d(v2));
}

function scale3d(v, a) {
    return [
        v[0] * a,
        v[1] * a,
        v[2] * a,
        v[3] * a,
    ]
}

function scale4d(v, a) {
    return [
        v[0] * a,
        v[1] * a,
        v[2] * a,
        v[3] * a,
    ]
}
function scaleMat4d(m, a) {
    return [
        scale4d(m[0], a),
        scale4d(m[1], a),
        scale4d(m[2], a),
        scale4d(m[3], a),
    ]
}

function inn4d(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2] + v1[3] * v2[3];
}

function inns4d(v, mat3) {
    return [
        inn4d(v, mat3[0]),
        inn4d(v, mat3[1]),
        inn4d(v, mat3[2]),
    ];
}

// function cro3d(v1, v2) {
//     return [
//         v1[1] * v2[2] - v1[2] * v2[1],
//         - v1[0] * v2[2] + v1[0] * v2[2],
//         v1[0] * v2[1] - v1[0] * v2[1],
//     ]
// }
