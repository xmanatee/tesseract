if (typeof String.prototype.startsWith !== "function") {
    String.prototype.startsWith = function (str){
        return this.slice(0, str.length) === str;
    };
}

function mesh_from_obj(objectData, scale_pos=true, scale_tex=false) {
    let positions = [];
    let normals = [];
    let textures = [];
    let faces = [];

    function abs_id(id, numVertices) {
        if (id < 0) {
            return numVertices + id;
        } else {
            return parseInt(id) - 1;
        }
    }

    let lines = objectData.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("v ")) {
            const line_floats = lines[i].slice(2).split(" ").filter(word => word).map(str => parseFloat(str));
            positions.push(line_floats[0]);
            positions.push(line_floats[1]);
            positions.push(line_floats[2]);
        }
        else if (lines[i].startsWith("vn")) {
            const line_floats = lines[i].slice(3).split(" ").filter(word => word).map(str => parseFloat(str));
            normals.push(line_floats[0]);
            normals.push(line_floats[1]);
            normals.push(line_floats[2]);
        }
        else if (lines[i].startsWith("vt")) {
            const line_floats = lines[i].slice(3).split(" ").filter(word => word).map(str => parseFloat(str));
            textures.push(line_floats[0]);
            textures.push(line_floats[1]);
        }
        else if (lines[i].startsWith("f ")) {
            let face = [];
            const line = lines[i].slice(2).split(" ").filter(word => word);
            for (let j = 0; j < line.length; j++) {
                const face_vertex_ids = line[j].split("/").map(str => parseInt(str));
                let a = abs_id(face_vertex_ids[0], positions.length);
                let b = abs_id(face_vertex_ids[1], textures.length);
                let c = abs_id(face_vertex_ids[2], normals.length);
                face.push([a, b, c]);
            }
            faces.push(face);
        }
        else if (lines[i].startsWith("usemtl ")) {
            // TODO: use different textures
        }
    }

    const packed = {
        positions: [],
        normals: [],
        textures: [],
        indices: [],
    };
    let hashed_vertices = {};
    let index = 0;
    for (let i = 0; i < faces.length; ++i) {
        const face = faces[i];

        let face_indices = [];
        for (let j = 0; j < face.length; ++j) {
            const hash = face[j].join("/");
            if (hash in hashed_vertices) {
                face_indices.push(hashed_vertices[hash]);
                continue;
            }
            const a = face[j][0];
            const b = face[j][1];
            const c = face[j][2];

            packed.positions.push(positions[a * 3]);
            packed.positions.push(positions[a * 3 + 1]);
            packed.positions.push(positions[a * 3 + 2]);
            packed.textures.push(textures[b * 2]);
            packed.textures.push(textures[b * 2 + 1]);
            packed.normals.push(normals[c * 3]);
            packed.normals.push(normals[c * 3 + 1]);
            packed.normals.push(normals[c * 3 + 2]);

            hashed_vertices[hash] = index;
            face_indices.push(index);
            ++index;
        }

        for (let j = 2; j < face_indices.length; ++j) {
            packed.indices.push(face_indices[0], face_indices[j - 1], face_indices[j]);
        }
    }

    if (scale_pos) {
        scale_obj_positions(packed);
    }

    if (scale_tex) {
        scale_obj_texture(packed);
    }

    return packed;
}

function scale_obj_positions(packed) {
    let scales = [];
    for (let offset = 0; offset < 3; ++offset) {
        let min = 1e6, max = -1e6, sum = 0.0, n = 0;
        for (let i = offset; i < packed.positions.length; i += 3) {
            if (typeof packed.positions[i] === 'undefined') { continue; }
            let v = packed.positions[i];
            min = Math.min(min, v);
            max = Math.max(max, v);
            sum = sum + v;
            ++n;
        }
        const avg = sum / n;
        const scale = (max - min) / 2;
        scales.push(scale);
        for (let i = offset; i < packed.positions.length; i += 3) {
            packed.positions[i] = (packed.positions[i] - avg);
        }
    }
    const scale = Math.max(...scales);
    for (let i = 0; i < packed.positions.length; ++i) {
        packed.positions[i] = packed.positions[i] / scale;
    }

    return packed;
}

function scale_obj_texture(packed) {
    for (let offset = 0; offset < 2; ++offset) {
        let min = 1e6, max = -1e6, sum = 0.0, n = 0;
        for (let i = offset; i < packed.textures.length; i += 2) {
            if (typeof packed.textures[i] === 'undefined') { continue; }
            let v = parseFloat(packed.textures[i]);
            min = Math.min(min, v);
            max = Math.max(max, v);
            sum = sum + v;
            ++n;
        }
        for (let i = offset; i < packed.textures.length; i += 2) {
            packed.textures[i] = (packed.textures[i] - min) / scale;
        }
    }
    console.log(packed);
    return packed;
}
