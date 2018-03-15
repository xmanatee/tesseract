function gl_attribute(
    numComponents,
    type,
    vertexAttributeName,
    bufferName,
    stride=0,
    offset=0,
    normalize=false,) {
    console.assert(numComponents && type && vertexAttributeName && bufferName);
    return {
        numComponents: numComponents,
        type: type,
        normalize: normalize,
        stride: stride,
        offset: offset,
        vertexAttributeName: vertexAttributeName,
        bufferName: bufferName,
    }
}

function std_gl_attributes(gl) {
    return [
        // gl_attribute(4, gl.FLOAT, "vertexColor", "color"),
        gl_attribute(3, gl.FLOAT, "vertexPosition", "position"),
        gl_attribute(3, gl.FLOAT, "vertexNormal", "normal"),
        gl_attribute(2, gl.FLOAT, "textureCoord", "texture"),
    ]
}

function init_std_buffers(gl, mesh, kwargs) {

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.positions), gl.STATIC_DRAW);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.normals), gl.STATIC_DRAW);

    const textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW);

    // const colorBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.colors), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        normal: normalBuffer,
        texture: textureBuffer,
        // color: colorBuffer,
        indices: indexBuffer,
        numVertices: mesh.indices.length,
        attributes: std_gl_attributes(gl),
    };
}

const FLOAT_SIZE = 4;

function opt_gl_attributes(gl) {
    return [
        gl_attribute(3, gl.FLOAT, "vertexPosition", "buffer", 8 * FLOAT_SIZE, 0),
        gl_attribute(3, gl.FLOAT, "vertexNormal", "buffer", 8 * FLOAT_SIZE, 3 * FLOAT_SIZE),
        gl_attribute(2, gl.FLOAT, "textureCoord", "buffer", 8 * FLOAT_SIZE, 6 * FLOAT_SIZE),
    ]
}

function init_opt_buffers(gl, mesh) {
    const buffer = [];
    const num_vertices = mesh.positions.length / 3;
    for (let i = 0; i < num_vertices; ++i) {
        buffer.push(
            mesh.positions[3 * i],
            mesh.positions[3 * i + 1],
            mesh.positions[3 * i + 2],
            mesh.normals[3 * i],
            mesh.normals[3 * i + 1],
            mesh.normals[3 * i + 2],
            mesh.textures[2 * i],
            mesh.textures[2 * i + 1],
        )
    }

    const cvntBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cvntBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

    return {
        buffer: cvntBuffer,
        indices: indexBuffer,
        numVertices: mesh.indices.length,
        attributes: opt_gl_attributes(gl),
    };
}

// const init_buffers = init_std_buffers;
const init_buffers = init_opt_buffers;