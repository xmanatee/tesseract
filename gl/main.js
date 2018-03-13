
let x = 0.0;
let y = 0.0;
let z = -10.0;

const MAX_TURN = 0.003;
const MAX_LAT = 1;
let view_lat = 0;
let view_lon = 0;

const MAX_VELOCITY = 5.0;
let stright_velocity = 0;
let side_velocity = 0;

const FPS_LR = 0.1;
let fps = 0;

function draw(gl) {
    let shaderProgram = null;
    shaderProgram = initShaderProgram(gl, vertexShader, colorFragmentShader);
    const colorProgramInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            // textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            // uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        },
    };

    shaderProgram = initShaderProgram(gl, vertexShader, textureFragmentShader);
    const textureProgramInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            // vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        },
    };

    const kwargs = {
        cube_half_side: 0.3,

        thor_r_big: 2,
        thor_num_lon: 100,
        thor_r_small: 1,
        thor_num_lat: 30,

        sphere_r: 40,
        sphere_num_lon: 100,
        sphere_num_lat: 100,
    };

    const figuresInfo = [
        {
            programInfo: textureProgramInfo,
            buffers: initBuffers(gl, buildThorMesh, kwargs),
            rotation: {
                angle: 0,
                vec: [1, 0, 0],
                speed: 1,
            },
            texture: loadTexture(gl, 'textures/Lava_001_COLOR.png'),
        },
        {
            programInfo: textureProgramInfo,
            buffers: initBuffers(gl, buildSphereMesh, kwargs),
            rotation: {
                angle: 0,
                vec: [0, 1, 0],
                speed: 0.05,
            },
            texture: loadTexture(gl, 'textures/Lava_001_COLOR.png'),
        },
        {
            programInfo: textureProgramInfo,
            buffers: initBuffers(gl, buildCubeMesh, kwargs),
            rotation: {
                angle: 0,
                vec: [1, 1, 1],
                speed: 10,
            },
            texture: loadTexture(gl, 'textures/Lava_002_COLOR.png'),
        },
    ];

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

    figuresInfo.forEach((figureInfo) => {
        drawFigure(gl, figureInfo);
    })

}

function drawFigure(gl, figureInfo) {

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    gl.useProgram(figureInfo.programInfo.program);

    const fieldOfView = 45 * Math.PI / 180;   // in radians
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

    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, figureInfo.buffers.position);
        gl.vertexAttribPointer(
            figureInfo.programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            figureInfo.programInfo.attribLocations.vertexPosition);
    }

    if ("texture" in figureInfo) {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, figureInfo.buffers.texture);
        gl.vertexAttribPointer(
            figureInfo.programInfo.attribLocations.textureCoord,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            figureInfo.programInfo.attribLocations.textureCoord);
    } else {
        // console.log("No text")
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, figureInfo.buffers.color);
        gl.vertexAttribPointer(
            figureInfo.programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            figureInfo.programInfo.attribLocations.vertexColor);
    }

    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, figureInfo.buffers.normal);
        gl.vertexAttribPointer(
            figureInfo.programInfo.attribLocations.vertexNormal,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            figureInfo.programInfo.attribLocations.vertexNormal);
    }


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
