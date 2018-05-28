
const FPS_LR = 0.1;
let fps = 0;

let binocular = false;

function clearDrawBuffers(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function startGame(gl) {

    init_game_surface();

    // const player = new Player(-10, 0, 0, 0, key_triggers);
    init_programs(gl);

    const figures = build_figures(gl, figuresConfig);

    const easterCallback = () => {
        figures[3].on = !figures[3].on;
        figures[4].on = !figures[4].on;
    };
    document.getElementById("easter_btn").onclick = easterCallback;
    key_itriggers["e"] = easterCallback;


    const binocularCallback = () => {
        binocular = !binocular;
    };
    document.getElementById("binocular_btn").onclick = binocularCallback;
    key_itriggers["b"] = binocularCallback;

    let plane_rotation_f = 0;
    let plane_rotation_s = 1;
    const plane_rotation_angle = 0.1;
    key_itriggers["t"] = () => {
        plane_rotation_f = (plane_rotation_f + 1) % 4;
        plane_rotation_s = (plane_rotation_s + 1) % 4;
    };
    key_triggers["r"] = () => {
        figures.forEach((figure) => {
            if (figure.id === "thor4d") {
                let cosa = Math.cos(plane_rotation_angle);
                let sina = Math.sin(plane_rotation_angle);

                for (let i = 0; i < 4; ++i) {
                    const a = figure.surface.plane[i][plane_rotation_f];
                    const b = figure.surface.plane[i][plane_rotation_s];
                    figure.surface.plane[i][plane_rotation_f] = a * cosa + b * sina;
                    figure.surface.plane[i][plane_rotation_s] = -a * sina + b * cosa;
                }

                const mesh = mesh_from_surface(
                    figure.surface_instance,
                    figure.surface.det,
                    figure.surface.plane,
                    figure.surface.plane_base
                );
                figure.buffers = init_buffers(gl, mesh);
            }
        })
    };

    console.log(gl.fillText);

    Player(key_triggers);

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

        tryFixSize(gl);
        clearDrawBuffers(gl);
        if (!binocular) {
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            drawScene(gl, figures);
        } else {
            const half_width = gl.drawingBufferWidth / 2;
            view_shift_right = 0.1;
            gl.viewport(0, 0, half_width, gl.drawingBufferHeight);
            drawScene(gl, figures);
            view_shift_right = -0.1;
            gl.viewport(half_width, 0, half_width, gl.drawingBufferHeight);
            drawScene(gl, figures);
            view_shift_right = 0;
        }
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function drawScene(gl, figures) {

    figures.filter(figure => figure.on).forEach((figure) => {
        drawFigure(gl, figure);
    })
}

function drawFigure(gl, figure) {
    gl.useProgram(figure.programInfo.program);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.getParameter(gl.VIEWPORT)[2] / gl.getParameter(gl.VIEWPORT)[3];
    // const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;

    const projectionMatrix = mat4.create();
    mat4.perspective(
        projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    const viewMatrix = player_view();
    const viewPosition = player_xyz();
    const modelMatrix = figure_view(figure);

    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);


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

    gl.uniformMatrix4fv(
        figure.programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    // gl.uniformMatrix4fv(
    //     figure.programInfo.uniformLocations.viewMatrix,
    //     false,
    //     viewMatrix);
    gl.uniformMatrix4fv(
        figure.programInfo.uniformLocations.modelMatrix,
        false,
        modelMatrix);
    gl.uniformMatrix4fv(
        figure.programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
    gl.uniform3fv(
        figure.programInfo.uniformLocations.viewPosition,
        viewPosition);

    let figure_intensity = 1;
    const time_sec = new Date().getTime() / 1000.0;
    if (figure.intensity) {
        figure_intensity = figure.intensity.mean + figure.intensity.scale * Math.sin(2 * Math.PI * time_sec / figure.intensity.period);
    }

    gl.uniform1f(
        figure.programInfo.uniformLocations.uIntensity,
        figure_intensity);
    gl.uniform1f(
        figure.programInfo.uniformLocations.uTime,
        time_sec);

    // gl.uniform1f(
    //     figure.programInfo.uniformLocations.uScale,
    //     sec2);

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
