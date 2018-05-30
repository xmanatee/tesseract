function initParticleBuffers(gl, particles, mesh) {
    const vertexArrays = [gl.createVertexArray(), gl.createVertexArray()];
    const transformFeedbacks = [gl.createTransformFeedback(), gl.createTransformFeedback()];
    const vertexBuffers = new Array(vertexArrays.length);

    for (let va = 0; va < vertexArrays.length; ++va) {
        gl.bindVertexArray(vertexArrays[va]);
        vertexBuffers[va] = new Array(particles.consts.location.num);

        let loc = particles.consts.location.offset;
        vertexBuffers[va][loc] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[va][loc]);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.offsets, gl.STREAM_COPY);
        gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(loc);

        loc = particles.consts.location.velocity;
        vertexBuffers[va][loc] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[va][loc]);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.velocities, gl.STREAM_COPY);
        gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(loc);

        loc = particles.consts.location.position;
        vertexBuffers[va][loc] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[va][loc]);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(loc);

        loc = particles.consts.location.mass;
        vertexBuffers[va][loc] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[va][loc]);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.masses, gl.STATIC_DRAW);
        gl.vertexAttribPointer(loc, 1, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(loc);

        loc = particles.consts.location.color;
        vertexBuffers[va][loc] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[va][loc]);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.colors, gl.STATIC_DRAW);
        gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribDivisor(loc, 1);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // Set up output
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks[va]);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, vertexBuffers[va][particles.consts.location.offset]);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, vertexBuffers[va][particles.consts.location.velocity]);

        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    }

    return [vertexArrays, transformFeedbacks, vertexBuffers];
}
