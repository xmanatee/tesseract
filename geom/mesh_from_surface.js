function scale(x, mu, s) {
    return mu + x * s;
}

function mesh_from_surface(surface, det, color_fn) {
    if (surface.is4d) {
        const plane = scaleMat4d([
            [1, 1, -1, -1],
            [1, -1, 1, -1],
            [1, -1, -1, 1],
            [1, 1, 1, 1],
        ], 0.5);
        const plane_base = [0, 0, 0, 0];
        return mesh_3d_from_mesh_4d(
            mesh_4d_from_surface_4d(surface, det, color_fn),
            plane,
            plane_base
        );
    }
    const [u_det, v_det] = det;
    const mesh = {
        positions: [],
        normals: [],
        textures: [],
        indices: [],
    };

    const uv_range = surface.uv_range();

    for (let u_i = 0; u_i < u_det + 1; ++u_i) {
        for (let v_i = 0; v_i < v_det + 1; ++v_i) {
            const tu = u_i / u_det;
            const tv = v_i / v_det;

            const u = scale(tu, uv_range.u_min, uv_range.u_max - uv_range.u_min);
            const v = scale(tv, uv_range.v_min, uv_range.v_max - uv_range.v_min);

            const [x, y, z] = vec(surface.xyz(u, v));
            const [nx, ny, nz] = vec(surface.nxyz(u, v));

            mesh.textures.push(tu, tv);
            mesh.positions.push(x, y, z);
            mesh.normals.push(nx, ny, nz);

            if (u_i === u_det || v_i === v_det) {
                continue;
            }
            const u_i_2 = u_i + 1;
            const v_i_2 = v_i + 1;

            const i_1 = u_i * (v_det + 1) + v_i;
            const i_2 = u_i * (v_det + 1) + v_i_2;
            const i_3 = u_i_2 * (v_det + 1) + v_i;
            const i_4 = u_i_2 * (v_det + 1) + v_i_2;

            mesh.indices.push(i_1, i_2, i_4);
            mesh.indices.push(i_1, i_4, i_3);

        }
    }
    if (color_fn) {
        mesh.colors = [];
        for (let u_i = 0; u_i < u_det + 1; ++u_i) {
            for (let v_i = 0; v_i < v_det + 1; ++v_i) {
                const tu = u_i / u_det;
                const tv = v_i / v_det;
                mesh.colors.push(...color_fn(tu, tv));
            }
        }
    }

    return mesh;
}
