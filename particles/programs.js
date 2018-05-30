function createParticleProgram(gl, vertexShaderSource, fragmentShaderSource, transformFeedback=false) {
    const program = gl.createProgram();
    const vshader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fshader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    gl.attachShader(program, vshader);
    gl.deleteShader(vshader);
    gl.attachShader(program, fshader);
    gl.deleteShader(fshader);
    if (transformFeedback) {
        const varyings = ['v_offset', 'v_velocity'];
        gl.transformFeedbackVaryings(program, varyings, gl.SEPARATE_ATTRIBS);
    }
    gl.linkProgram(program);

    let log = gl.getProgramInfoLog(program);
    if (log) { console.log(log); }

    log = gl.getShaderInfoLog(vshader);
    if (log) { console.log(log); }

    log = gl.getShaderInfoLog(fshader);
    if (log) { console.log(log); }

    return program;
}

function initParticlePrograms(gl) {

    const programTransform = createParticleProgram(gl, vs_transform_shader, fs_transform_shader, true);

    const programDraw = createParticleProgram(gl, vs_draw_shader, fs_draw_shader);

    return [programTransform, programDraw];
}
