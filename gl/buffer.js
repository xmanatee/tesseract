// const buildMesh = buildCubeMesh;
// const buildMesh = buildSphereMesh;
// const buildMesh = buildThorMesh;
// const buildMesh = multiMesh([buildSphereMesh, buildThorMesh]);


function initBuffers(gl, buildMesh, kwargs) {
    const mesh = buildMesh(kwargs);
    // console.log(mesh);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.positions), gl.STATIC_DRAW);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.normals), gl.STATIC_DRAW);

    const textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.colors), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        normal: normalBuffer,
        texture: textureBuffer,
        color: colorBuffer,
        indices: indexBuffer,
        numVertices: mesh.indices.length,
    };
}

function buildThorMesh(kwargs) {
    const r_big = kwargs.thor_r_big;
    const num_lon = kwargs.thor_num_lon;
    const r_small = kwargs.thor_r_small;
    const num_lat = kwargs.thor_num_lat;

    let positions = [];
    let normals = [];
    let textures = [];
    let colors = [];
    let indices = [];
    for (let i_lon = 0; i_lon < num_lon; i_lon++) {
        for (let i_lat = 0; i_lat < num_lat; i_lat++) {
            let u = 2 * Math.PI * i_lon / (num_lon - 1);
            let v = 2 * Math.PI * i_lat / (num_lat - 1);
            let x = (r_big + r_small * Math.cos(v)) * Math.cos(u);
            let y = (r_big + r_small * Math.cos(v)) * Math.sin(u);
            let z = r_small * Math.sin(v);
            let nx = Math.cos(v) * Math.cos(u);
            let ny = Math.cos(v) * Math.sin(u);
            let nz = Math.sin(v);

            textures.push(u, v);
            positions.push(x, y, z);
            colors.push(1 + 0.5 * Math.cos(u), 0, 1 + 0.5 * Math.cos(v), 1);
            normals.push(nx, ny, nz);

            let i_lon_2 = i_lon + 1;
            let i_lat_2 = i_lat + 1;
            if (i_lon_2 === num_lon || i_lat_2 === num_lat) {
                continue;
            }
            let i_1 = i_lon * num_lat + i_lat;
            let i_2 = i_lon * num_lat + i_lat_2;
            let i_3 = i_lon_2 * num_lat + i_lat;
            let i_4 = i_lon_2 * num_lat + i_lat_2;
            indices.push(i_1, i_2, i_4);
            indices.push(i_1, i_4, i_3);

        }
    }
    return {
        positions: positions,
        normals: normals,
        textures: textures,
        colors: colors,
        indices: indices,
    }
}

function buildSphereMesh(kwargs) {
    const r = kwargs.sphere_r;
    const num_lon = kwargs.sphere_num_lon;
    const num_lat = kwargs.sphere_num_lat;

    let positions = [];
    let normals = [];
    let textures = [];
    let colors = [];
    let indices = [];
    for (let i_lon = 0; i_lon < num_lon; i_lon++) {
        for (let i_lat = 0; i_lat < num_lat; i_lat++) {
            let u = 2 * Math.PI * i_lon / (num_lon - 1);
            let v = - Math.PI / 2 + Math.PI * i_lat / (num_lat - 1);
            let x = r * Math.cos(v) * Math.cos(u);
            let z = r * Math.cos(v) * Math.sin(u);
            let y = r * Math.sin(v);
            let nx = Math.cos(v) * Math.cos(u);
            let ny = Math.cos(v) * Math.sin(u);
            let nz = Math.sin(v);

            textures.push(i_lon / (num_lon - 1), i_lat / (num_lat - 1));
            positions.push(x, y, z);
            colors.push(0, 0.5 + 0.5 * Math.sin(v), 0.5 - 0.5 * Math.sin(v), 1);
            normals.push(nx, ny, nz);

            let i_lon_2 = i_lon + 1;
            let i_lat_2 = i_lat + 1;
            if (i_lon_2 === num_lon || i_lat_2 === num_lat) {
                continue;
            }
            let i_1 = i_lon * num_lat + i_lat;
            let i_2 = i_lon * num_lat + i_lat_2;
            let i_3 = i_lon_2 * num_lat + i_lat;
            let i_4 = i_lon_2 * num_lat + i_lat_2;

            indices.push(i_1, i_2, i_4);
            indices.push(i_1, i_4, i_3);

        }
    }
    return {
        positions: positions,
        normals: normals,
        textures: textures,
        colors: colors,
        indices: indices,
    }
}

function buildCubeMesh(kwargs) {
    const cube_half_side = kwargs.cube_half_side;

    let positions = [
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ].map(function (coord) {
        return coord * cube_half_side;
    });

    const normals = [
        // Front
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,

        // Back
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,

        // Top
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,

        // Bottom
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,

        // Right
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,

        // Left
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
    ];

    const textures = [
        // Front
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Back
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Top
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Bottom
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Right
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Left
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
    ];

    const up = 0.5;
    const faceColors = [
        [up,  0.0,  0.0,  1.0],    // Front face: white
        [0.0,  up,  0.0,  1.0],    // Back face: red
        [0.0,  0.0,  up,  1.0],    // Top face: green
        [0.0,  up,  up,  1.0],    // Bottom face: blue
        [up,  up,  0.0,  1.0],    // Right face: yellow
        [up,  0.0,  up,  1.0],    // Left face: purple
    ];
    let colors = [];
    for (let j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];
        colors = colors.concat(c, c, c, c);
    }

    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];

    return {
        positions: positions,
        normals: normals,
        textures: textures,
        colors: colors,
        indices: indices,
    }
}

function multiMesh(meshBuilders) {
    return function buildMultiMesh(kwargs) {
        let result_mesh = {
            positions: [],
            normals: [],
            textures: [],
            colors: [],
            indices: [],
        };

        for (let i = 0; i < meshBuilders.length; i++) {
            const mesh = meshBuilders[i](kwargs);
            const indices_offset = result_mesh.positions.length / 3;

            result_mesh.positions = result_mesh.positions.concat(mesh.positions);
            result_mesh.normals = result_mesh.normals.concat(mesh.normals);
            result_mesh.textures = result_mesh.textures.concat(mesh.textures);
            result_mesh.colors = result_mesh.colors.concat(mesh.colors);
            result_mesh.indices = result_mesh.indices.concat(mesh.indices.map(function (id) {
                return id + indices_offset;
            }));
        }

        return result_mesh;
    }
}
