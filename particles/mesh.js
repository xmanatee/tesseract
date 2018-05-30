function gaussianRand() {
    const N = 6;
    let S = 0;

    for (let i = 0; i < N; i += 1) {
        S += Math.random() - 0.5;
    }

    return S / Math.sqrt(N / 12);
}


function initParticlesMesh(
    num_instances,
    mean_mass=0.1,
    initial_offset_scale=10.0,
    initial_color_scale=0.1,
    size=20.0,
) {
    const mesh = {
        offsets: new Float32Array(num_instances * 3),
        velocities: new Float32Array(num_instances * 3),
        masses: new Float32Array(num_instances * 1),
        colors: new Float32Array(num_instances * 3),
    };

    for (let i = 0; i < num_instances; ++i) {
        mesh.offsets[3 * i] = gaussianRand() * initial_offset_scale;
        mesh.offsets[3 * i + 1] = gaussianRand() * initial_offset_scale;
        mesh.offsets[3 * i + 2] = gaussianRand() * initial_offset_scale;

        mesh.velocities[3 * i] = Math.random() * 0.01;
        mesh.velocities[3 * i + 1] = Math.random() * 0.01;
        mesh.velocities[3 * i + 2] = Math.random() * 0.01;

        mesh.masses[i] = mean_mass + 0.5 * mean_mass * Math.random();

        // mesh.colors[3 * i] = ;
        // mesh.colors[3 * i + 1] = Math.random();
        // mesh.colors[3 * i + 2] = Math.random();
        mesh.colors[3 * i] = 20 / 256.0 + 2 * initial_color_scale * Math.random() - initial_color_scale;
        mesh.colors[3 * i + 1] = 220 / 256.0 + 2 * initial_color_scale * Math.random() - initial_color_scale;
        mesh.colors[3 * i + 2] = 220 / 256.0 + 2 * initial_color_scale * Math.random() - initial_color_scale;
    }

    mesh.positions = new Float32Array([
        0.003, 0.0,
        -0.002, 0.002,
        -0.002, -0.002,
    ]);
    for (let i = 0; i < mesh.positions.length; ++i) {
        mesh.positions[i] *= size;
    }

    return mesh;
}
