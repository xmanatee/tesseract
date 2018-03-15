
const FPS_LR = 0.1;
let fps = 0;

// Math.PI.;
function startScene(gl) {

    init_game_surface();


    // const player = new Player(-10, 0, 0, 0, key_triggers);

    init_programs(gl);

    const figures = build_figures(gl, figuresConfig);

    const switchMeshes = (event) => {
        if (event.key === "q") {
            figures[3].on = !figures[3].on;
            figures[4].on = !figures[4].on;
        }
    };
    window.addEventListener("keydown", switchMeshes, false);

    let then = 0;
    function render(now) {
        now *= 0.001;
        const deltaTime = now - then;
        then = now;

        figures.forEach((figure) => {
            if (figure.rotation) {
                figure.rotation.angle += deltaTime * figure.rotation.speed;
            }
        });
        checkKeys();

        move(deltaTime);

        fps = fps + FPS_LR * (1 / deltaTime  - fps);
        fps_p.innerText = fps.toFixed(2);

        drawScene(gl, figures);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function drawScene(gl, figures) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    figures.filter(figure => figure.on).forEach((figure) => {
        drawFigure(gl, figure);
    })
}

function drawFigure(gl, figure) {

    gl.useProgram(figure.programInfo.program);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;

    const modelMatrix = mat4.create();

    const projectionMatrix = mat4.create();
    mat4.perspective(
        projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    // const u = x / 10;
    // const v = z / 10;
    // const viewMatrix = mat4.fromValues(
    //     ...vec(game_surface.dv(u, v)), 0,
    //     ...vec(game_surface.nxyz(u, v)), 0,
    //     ...vec(game_surface.du(u, v)), 0,
    //     0, 0, 0, 1);

    // const viewMatrix = mat4.create();
    // mat4.rotate(
    //     viewMatrix,
    //     viewMatrix,
    //     view_lon,
    //     [0, 1, 0]);
    // mat4.rotate(
    //     viewMatrix,
    //     viewMatrix,
    //     view_lat,
    //     [Math.cos(view_lon), 0, Math.sin(view_lon)]);
    // mat4.translate(
    //     viewMatrix,
    //     viewMatrix,
    //     player_xyz());

    const viewMatrix = player_view();

    if (figure.rotation) {
        mat4.rotate(
            modelMatrix,
            modelMatrix,
            figure.rotation.angle,
            figure.rotation.vec);
    }
    if (figure.start_rotation) {
        mat4.rotate(
            modelMatrix,
            modelMatrix,
            figure.start_rotation.angle,
            figure.start_rotation.vec);
    }
    if (figure.start_translation) {
        mat4.translate(
            modelMatrix,
            modelMatrix,
            figure.start_translation.vec);
    }

    figure.buffers.attributes.forEach((attr) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, figure.buffers[attr.bufferName]);
        gl.vertexAttribPointer(
            figure.programInfo.attribLocations[attr.vertexAttributeName],
            attr.numComponents,
            attr.type,
            attr.normalize,
            attr.stride,
            attr.offset);
        gl.enableVertexAttribArray(
            figure.programInfo.attribLocations[attr.vertexAttributeName]);
    });

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, figure.buffers.indices);

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    gl.uniformMatrix4fv(
        figure.programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix);
    gl.uniformMatrix4fv(
        figure.programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        figure.programInfo.uniformLocations.viewMatrix,
        false,
        viewMatrix);
    gl.uniformMatrix4fv(
        figure.programInfo.uniformLocations.modelMatrix,
        false,
        modelMatrix);

    if ("texture" in figure) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, figure.texture);
        gl.uniform1i(figure.programInfo.uniformLocations.uSampler, 0);
    }

    {
        const vertexCount = figure.buffers.numVertices;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}
