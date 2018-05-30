function initParticles(gl, num_instances) {
    particles.consts.num_instances = num_instances;
    particles.last_time = new Date().getTime() / 1000;

    particles.programs = initParticlePrograms(gl);

    const mesh = initParticlesMesh(particles.consts.num_instances, 0.003);

    particles.uniformLocations = {
        dtime: gl.getUniformLocation(particles.programs[particles.consts.program.transform], 'u_dtime'),
        magnetCenter: gl.getUniformLocation(particles.programs[particles.consts.program.transform], 'u_magnet_center'),
        viewMatrix: gl.getUniformLocation(particles.programs[particles.consts.program.draw], 'uViewMatrix'),
        projectionMatrix: gl.getUniformLocation(particles.programs[particles.consts.program.draw], 'uProjectionMatrix'),
    };

    [particles.vao, particles.tfo, particles.vbo] = initParticleBuffers(gl, particles, mesh);

    particles.f = {};
    particles.f.updateTime = () => {
        const cur_time = new Date().getTime() / 1000;
        const dtime = cur_time - particles.last_time;
        particles.last_time = cur_time;
        return dtime;
    };

    particles.f.bindBuffers = () =>  {
        initParticleBuffers(gl, particles, mesh);
    };

    particles.f.transform = () => {
        const dtime = particles.f.updateTime();
        transformParticles(gl, particles, dtime);
    };

    particles.f.draw = () => {
        drawParticles(gl, particles);
    };

    return particles;
}
