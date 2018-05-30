function initParticlesMesh(num_instances, mean_mass=0.1) {
    const mesh = {
        offsets: new Float32Array(num_instances * 3),
        velocities: new Float32Array(num_instances * 3),
        masses: new Float32Array(num_instances * 1),
        colors: new Float32Array(num_instances * 3),
    };

    for (let i = 0; i < num_instances; ++i) {
        mesh.offsets[3 * i] = Math.random() * 2.0 - 1.0;
        mesh.offsets[3 * i + 1] = Math.random() * 2.0 - 1.0;
        mesh.offsets[3 * i + 2] = Math.random() * 2.0 - 1.0;

        mesh.velocities[3 * i] = Math.random() * 0.01;
        mesh.velocities[3 * i + 1] = Math.random() * 0.01;
        mesh.velocities[3 * i + 2] = Math.random() * 0.01;

        mesh.masses[i] = mean_mass + 0.5 * mean_mass * Math.random();

        // mesh.colors[3 * i] = ;
        // mesh.colors[3 * i + 1] = Math.random();
        // mesh.colors[3 * i + 2] = Math.random();
        mesh.colors[3 * i] = 20 / 256.0 + 0.6 * Math.random() - 0.3;
        mesh.colors[3 * i + 1] = 220 / 256.0 + 0.6 * Math.random() - 0.3;
        mesh.colors[3 * i + 2] = 220 / 256.0 + 0.6 * Math.random() - 0.3;
    }

    mesh.positions = new Float32Array([
        0.015, 0.0,
        -0.010, 0.010,
        -0.010, -0.010,
    ]);

    return mesh;
}
