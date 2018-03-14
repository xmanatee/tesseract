let x = 0.0;
let y = 0.0;
let z = -7.0;

const MAX_TURN = 0.003;
const MAX_LAT = 1;
let view_lat = 0;
let view_lon = 0;

const MAX_VELOCITY = 5.0;
let stright_velocity = 0;
let side_velocity = 0;

const FPS_LR = 0.1;
let fps = 0;

// const player = require("player.js");

function startScene(gl) {

    // const player = new Player(-10, 0, 0, 0, key_triggers);

    initPrograms(gl);

    const figuresInfo = [
        {
            programInfo: programs.textured,
            buffers: initBuffers(gl, buildThorMesh, {
                thor_r_big: 2.7,
                thor_num_lon: 100,
                thor_r_small: 1,
                thor_num_lat: 30,}),
            on: true,
            rotation: {
                angle: 0,
                vec: [1, 0, 0],
                speed: 1,
            },
            bufferAttributes: [
                {
                    numComponents: 4,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexColor",
                    bufferName: "color",
                },
                {
                    numComponents: 3,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexPosition",
                    bufferName: "position",
                },
                {
                    numComponents: 3,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexNormal",
                    bufferName: "normal",
                },
                {
                    numComponents: 2,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "textureCoord",
                    bufferName: "texture",
                },
            ],
            texture: loadTexture(gl, 'textures/Lava_001_COLOR.png'),
        },
        {
            programInfo: programs.textured,
            buffers: initBuffers(gl, buildSphereMesh, {
                sphere_r: 40,
                sphere_num_lon: 100,
                sphere_num_lat: 100,
            }),
            on: true,
            rotation: {
                angle: 0,
                vec: [0, 1, 0],
                speed: 0.05,
            },
            bufferAttributes: [
                {
                    numComponents: 4,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexColor",
                    bufferName: "color",
                },
                {
                    numComponents: 3,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexPosition",
                    bufferName: "position",
                },
                {
                    numComponents: 3,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexNormal",
                    bufferName: "normal",
                },
                {
                    numComponents: 2,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "textureCoord",
                    bufferName: "texture",
                },
            ],
            texture: loadTexture(gl, 'textures/Tiles_012_ROUGH.jpg'),
        },
        {
            programInfo: programs.textured,
            buffers: initBuffers(gl, () => {return scale_obj_positions(parse_obj(obj_meshes.cerberus));}),
            on: true,
            rotation: {
                angle: 0,
                vec: [0, 1, 0],
                speed: -1,
            },
            translation: {
                vec: [0, 1, 0],
            },
            bufferAttributes: [
                {
                    numComponents: 4,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexColor",
                    bufferName: "color",
                },
                {
                    numComponents: 3,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexPosition",
                    bufferName: "position",
                },
                {
                    numComponents: 3,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexNormal",
                    bufferName: "normal",
                },
                {
                    numComponents: 2,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "textureCoord",
                    bufferName: "texture",
                },
            ],
            texture: loadTexture(gl, 'textures/grid_color.jpg'),
        },
        {
            programInfo: programs.textured,
            // Object.values(obj_meshes)[0]
            buffers: initBuffers(gl, () => {return scale_obj_positions(parse_obj(obj_meshes.naruto));}),
            on: false,
            rotation: {
                angle: 0,
                vec: [0, 1, 0],
                speed: 0.5,
            },
            start_rotation: {
                angle: -0.5 * Math.PI,
                vec: [1, 0, 0],
            },
            bufferAttributes: [
                {
                    numComponents: 4,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexColor",
                    bufferName: "color",
                },
                {
                    numComponents: 3,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexPosition",
                    bufferName: "position",
                },
                {
                    numComponents: 3,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexNormal",
                    bufferName: "normal",
                },
                {
                    numComponents: 2,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "textureCoord",
                    bufferName: "texture",
                },
            ],
            texture: loadTexture(gl, 'textures/naruto_1.png'),
        },
        {
            programInfo: programs.textured,
            buffers: initBuffers(gl, () => {return scale_obj_positions(parse_obj(obj_meshes.flash));}),
            on: true,
            rotation: {
                angle: 0,
                vec: [0, 1, 0],
                speed: 0.5,
            },
            bufferAttributes: [
                {
                    numComponents: 4,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexColor",
                    bufferName: "color",
                },
                {
                    numComponents: 3,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexPosition",
                    bufferName: "position",
                },
                {
                    numComponents: 3,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "vertexNormal",
                    bufferName: "normal",
                },
                {
                    numComponents: 2,
                    type: gl.FLOAT,
                    normalize: false,
                    stride: 0,
                    offset: 0,
                    vertexAttributeName: "textureCoord",
                    bufferName: "texture",
                },
            ],
            texture: loadTexture(gl, 'textures/FL_CW_A_1.png'),
        },
    ];

    const switchMeshes = (event) => {
        if (event.key === "q") {
            figuresInfo[3].on = !figuresInfo[3].on;
            figuresInfo[4].on = !figuresInfo[4].on;
        }
    };
    window.addEventListener("keydown", switchMeshes, false);

    let then = 0;
    function render(now) {
        now *= 0.001;
        const deltaTime = now - then;
        then = now;

        figuresInfo.forEach((figureInfo) => {
            if (figureInfo.rotation) {
                figureInfo.rotation.angle += deltaTime * figureInfo.rotation.speed;
            }
        });
        checkKeys();
        z += (Math.cos(view_lon) * stright_velocity + Math.sin(view_lon) * side_velocity) * deltaTime;
        x += (-Math.sin(view_lon) * stright_velocity + Math.cos(view_lon) * side_velocity) * deltaTime;
        stright_velocity = 0;
        side_velocity = 0;

        fps = fps + FPS_LR * (1 / deltaTime  - fps);
        fps_p.innerText = fps.toFixed(2);

        drawScene(gl, figuresInfo);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function drawScene(gl, figuresInfo) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    figuresInfo.filter(figureInfo => figureInfo.on).forEach((figureInfo) => {
        drawFigure(gl, figureInfo);
    })

}

function drawFigure(gl, figureInfo) {

    gl.useProgram(figureInfo.programInfo.program);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(
        projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    const modelViewMatrix = mat4.create();

    mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        view_lon,
        [0, 1, 0]);
    mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        view_lat,
        [Math.cos(view_lon), 0, Math.sin(view_lon)]);
    mat4.translate(
        modelViewMatrix,
        modelViewMatrix,
        [x, y, z]);
    if (figureInfo.rotation) {
        mat4.rotate(
            modelViewMatrix,
            modelViewMatrix,
            figureInfo.rotation.angle,
            figureInfo.rotation.vec);
    }
    if (figureInfo.start_rotation) {
        mat4.rotate(
            modelViewMatrix,
            modelViewMatrix,
            figureInfo.start_rotation.angle,
            figureInfo.start_rotation.vec);
    }
    if (figureInfo.translation) {
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            figureInfo.translation.vec);
    }
    figureInfo.bufferAttributes.forEach((attr) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, figureInfo.buffers[attr.bufferName]);
        gl.vertexAttribPointer(
            figureInfo.programInfo.attribLocations[attr.vertexAttributeName],
            attr.numComponents,
            attr.type,
            attr.normalize,
            attr.stride,
            attr.offset);
        gl.enableVertexAttribArray(
            figureInfo.programInfo.attribLocations[attr.vertexAttributeName]);
    });

    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, figureInfo.buffers.indices);
    }

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    gl.uniformMatrix4fv(
        figureInfo.programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix);
    gl.uniformMatrix4fv(
        figureInfo.programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        figureInfo.programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    if ("texture" in figureInfo) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, figureInfo.texture);
        gl.uniform1i(figureInfo.programInfo.uniformLocations.uSampler, 0);
    }

    {
        const vertexCount = figureInfo.buffers.numVertices;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}
