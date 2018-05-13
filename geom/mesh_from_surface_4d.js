function scale(x, mu, s) {
    return mu + x * s;
}

function mesh_4d_from_surface_4d(surface, det, color_fn) {
    const mesh = {
        positions: [],
        normals: [],
        textures: [],
        indices: [],
    };
    const [w_det, u_det, v_det] = det;

    const wuv_range = surface.wuv_range();

    for (let w_i = 0; w_i < w_det + 1; ++w_i) {
        for (let u_i = 0; u_i < u_det + 1; ++u_i) {
            for (let v_i = 0; v_i < v_det + 1; ++v_i) {
                const tw = w_i / w_det;
                const tu = u_i / u_det;
                const tv = v_i / v_det;

                const w = scale(tw, wuv_range.w_min, wuv_range.w_max - wuv_range.w_min);
                const u = scale(tu, wuv_range.u_min, wuv_range.u_max - wuv_range.u_min);
                const v = scale(tv, wuv_range.v_min, wuv_range.v_max - wuv_range.v_min);

                const [x, y, z, q] = vec4d(surface.xyzq(w, u, v));
                const [nx, ny, nz, nq] = vec4d(surface.nxyzq(w, u, v));

                mesh.textures.push(tw, tu, tv);
                mesh.positions.push(x, y, z, q);
                mesh.normals.push(nx, ny, nz, nq);

                if (u_i === u_det || v_i === v_det || w_i === w_det) {
                    continue;
                }
                const w_i_2 = w_i + 1;
                const u_i_2 = u_i + 1;
                const v_i_2 = v_i + 1;

                const i = w_i * (u_det + 1) * (v_det + 1) + u_i * (v_det + 1) + v_i;
                const i_w = w_i_2 * (u_det + 1) * (v_det + 1) + u_i * (v_det + 1) + v_i;
                const i_u = w_i * (u_det + 1) * (v_det + 1) + u_i_2 * (v_det + 1) + v_i;
                const i_v = w_i * (u_det + 1) * (v_det + 1) + u_i * (v_det + 1) + v_i_2;
                const i_w_u = w_i_2 * (u_det + 1) * (v_det + 1) + u_i_2 * (v_det + 1) + v_i;
                const i_w_v = w_i_2 * (u_det + 1) * (v_det + 1) + u_i * (v_det + 1) + v_i_2;
                const i_u_v = w_i * (u_det + 1) * (v_det + 1) + u_i_2 * (v_det + 1) + v_i_2;
                const i_w_u_v = w_i_2 * (u_det + 1) * (v_det + 1) + u_i_2 * (v_det + 1) + v_i_2;

                const simplices = [
                    i_w, i_u, i_w_u_v, i,
                    i_w, i_u, i_w_u_v, i_w_u,

                    i_w, i_v, i_w_u_v, i,
                    i_w, i_v, i_w_u_v, i_w_v,

                    i_u, i_v, i_w_u_v, i,
                    i_u, i_v, i_w_u_v, i_u_v,
                ];

                mesh.indices.push(...simplices);
            }
        }
    }
    if (color_fn) {
        mesh.colors = [];
        for (let w_i = 0; w_i < w_det + 1; ++w_i) {
            for (let u_i = 0; u_i < u_det + 1; ++u_i) {
                for (let v_i = 0; v_i < v_det + 1; ++v_i) {
                    const tw = w_i / w_det;
                    const tu = u_i / u_det;
                    const tv = v_i / v_det;
                    mesh.colors.push(...color_fn(tw, tu, tv));
                }
            }
        }
    }

    return mesh;
}

function mesh_3d_from_mesh_4d(mesh_4d, plane, plane_base) {
    // const plane = scaleMat4d([
    //     [1, 1, -1, -1],
    //     [1, -1, 1, -1],
    //     [1, -1, -1, 1],
    //     [1, 1, 1, 1],
    // ], 0.5);
    // const plane_base = [0, 0, 0, 0];

    const abcd = plane[3];

    const mesh_3d = {
        positions: [],
        normals: [],
        textures: [],
        indices: [],
    };
    let indices_count = 0;

    let hashed_vertices = {};

    for (let i = 0; 4 * i < mesh_4d.indices.length; ++i) {
        const found_ids = [];
        for (let f = 0; f < 4; ++f) {
            const v_i_1 = mesh_4d.indices[4 * i + f];
            const v_1 = sub4d(read4d(mesh_4d.positions, 4 * v_i_1), plane_base);
            for (let s = f + 1; s < 4; ++s) {
                const v_i_2 = mesh_4d.indices[4 * i + s];

                if ([v_i_1, v_i_2] in hashed_vertices && hashed_vertices[[v_i_1, v_i_2]] !== -1) {
                    found_ids.push(hashed_vertices[[v_i_1, v_i_2]]);
                    continue;
                }
                else if (hashed_vertices[[v_i_1, v_i_2]] === -1) {
                    continue;
                }

                const v_2 = sub4d(read4d(mesh_4d.positions, 4 * v_i_2), plane_base);
                const v_d = sub4d(v_2, v_1);

                if (inn4d(v_d, abcd) === 0) {
                    continue;
                }
                const t = - inn4d(v_1, abcd) / inn4d(v_d, abcd);

                if (0 <= t && t <= 1) {
                    const v = sum4d(v_1, scale4d(v_d, t));
                    const vn_1 = read4d(mesh_4d.normals, 4 * v_i_1);
                    const vn_2 = read4d(mesh_4d.normals, 4 * v_i_2);
                    const vt_1 = read3d(mesh_4d.textures, 3 * v_i_1);
                    const vt_2 = read3d(mesh_4d.textures, 3 * v_i_2);
                    mesh_3d.positions.push(...inns4d(v, plane));
                    mesh_3d.normals.push(...inns4d(sum4d(scale4d(vn_1, t), scale4d(vn_2, 1 - t)), plane));
                    mesh_3d.textures.push(...to3d(sum3d(scale3d(vt_1, t), scale3d(vt_2, 1 - t))));
                    found_ids.push(indices_count);
                    hashed_vertices[[v_i_1, v_i_2]] = indices_count;
                    indices_count++;
                } else {
                    hashed_vertices[[v_i_1, v_i_2]] = -1;
                }
            }
        }
        if (found_ids.length === 3) {

            mesh_3d.indices.push(
                found_ids[0], found_ids[1], found_ids[2]
            );
        }
        else if (found_ids.length === 4) {
            mesh_3d.indices.push(
                found_ids[0], found_ids[1], found_ids[2],
                found_ids[1], found_ids[2], found_ids[3]
            );
        }
        else if (found_ids.length !== 0) {
            console.error("found_ids.length !== 3/4/0 ", found_ids.length);

        }
    }

    return mesh_3d;
}
