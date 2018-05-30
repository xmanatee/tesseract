function transformParticles(gl, particles, dtime) {

    const destinationId = (particles.vars.currentSourceId + 1) % 2;
    const programTransform = particles.programs[particles.consts.program.transform];
    const sourceVAO = particles.vao[particles.vars.currentSourceId];
    const destinationTransformFeedback = particles.tfo[destinationId];

    gl.useProgram(programTransform);
    gl.uniform1f(particles.uniformLocations.dtime, dtime);
    // particles.vars.magnet_center = player_xyz();

    if (particles.vars.is_pushed) {
        particles.vars.magnet_push += 200 * dtime;
        particles.vars.is_pushed = false;
    } else {
        particles.vars.magnet_push += (particles.vars.magnet_push_min - particles.vars.magnet_push) * 20 * dtime;
    }

    let magnet_center = player_xyz();
    vec4.scaleAndAdd(magnet_center, magnet_center, new_forward, particles.vars.magnet_push);
    vec4.scaleAndAdd(magnet_center, magnet_center, new_up, -0.45);
    vec4.scaleAndAdd(magnet_center, magnet_center, new_right, 0.4);
    gl.uniform3f(particles.uniformLocations.magnetCenter, ...magnet_center);

    gl.bindVertexArray(sourceVAO);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, destinationTransformFeedback);

    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, particles.vbo[destinationId][particles.consts.location.offset]);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, particles.vbo[destinationId][particles.consts.location.velocity]);

    gl.vertexAttribDivisor(particles.consts.location.offset, 0);
    gl.vertexAttribDivisor(particles.consts.location.velocity, 0);

    gl.enable(gl.RASTERIZER_DISCARD);

    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, particles.consts.num_instances);
    gl.endTransformFeedback();

    gl.bindVertexArray(null);
    gl.disable(gl.RASTERIZER_DISCARD);
    gl.useProgram(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    particles.vars.currentSourceId = destinationId;
}

function drawParticles(gl, particles) {
    gl.bindVertexArray(particles.vao[particles.vars.currentSourceId]);
    gl.vertexAttribDivisor(particles.consts.location.offset, 1);
    gl.vertexAttribDivisor(particles.consts.location.velocity, 1);

    gl.useProgram(particles.programs[particles.consts.program.draw]);

    {
        const fieldOfView = 45 * Math.PI / 180;
        const aspect = gl.getParameter(gl.VIEWPORT)[2] / gl.getParameter(gl.VIEWPORT)[3];
        const zNear = 1.0;
        const zFar = 400.0;
        const projectionMatrix = mat4.create();
        mat4.perspective(
            projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);
        const viewMatrix = player_view();
        // const viewMatrix = mat4.create();
        // console.log(viewMatrix);
        gl.uniformMatrix4fv(particles.uniformLocations.viewMatrix, false, viewMatrix);
        gl.uniformMatrix4fv(particles.uniformLocations.projectionMatrix, false, projectionMatrix);
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, particles.consts.num_instances);

    gl.vertexAttribDivisor(particles.consts.location.offset, 0);
    gl.vertexAttribDivisor(particles.consts.location.velocity, 0);
    gl.disable(gl.BLEND);
    gl.bindVertexArray(null);
}