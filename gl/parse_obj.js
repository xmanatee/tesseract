if (typeof String.prototype.startsWith !== "function") {
    String.prototype.startsWith = function (str){
        return this.slice(0, str.length) === str;
    };
}

function parse_obj(objectData){
    let positions = [];
    let normals = [];
    let textures = [];
    let faces = [];
    let vertexCount = 0;
    let faceCounter = -1;

    let packed = {};
    packed.positions = [];
    packed.normals = [];
    packed.textures = [];
    packed.indices = [];

    function unsign(id, numVertices) {
        if (id < 0) {
            return numVertices + parseInt(id);
        } else {
            return parseInt(id) - 1;
        }
    }

    let lines = objectData.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("v ")) {
            const line = lines[i].slice(2).split(" ").filter(word => word);
            positions.push(line[0]);
            positions.push(line[1]);
            positions.push(line[2]);
            ++vertexCount;
        }
        else if (lines[i].startsWith("vn")) {
            const line = lines[i].slice(3).split(" ").filter(word => word);
            normals.push(line[0]);
            normals.push(line[1]);
            normals.push(line[2]);
        }
        else if (lines[i].startsWith("vt")) {
            const line = lines[i].slice(3).split(" ").filter(word => word);
            textures.push(line[0]);
            textures.push(line[1]);
        }
        else if (lines[i].startsWith("f ")) {
            faceCounter += 1;
            faces.push([]);
            const line = lines[i].slice(2).split(" ").filter(word => word);
            for (let j = 0; j < line.length; j++) {
                const face = line[j].split("/");
                let a = unsign(face[0], vertexCount);
                let b = unsign(face[1], vertexCount);
                let c = unsign(face[2], vertexCount);
                faces[faceCounter].push([a, b, c]);
            }
        }
    }

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
    delete packed.hashindices;
    delete packed.index;
    return packed;
}

function scale_obj_positions(packed) {
    let scales = [];
    for (let offset = 0; offset < 3; ++offset) {
        let min = 1e6, max = -1e6, sum = 0.0, n = 0;
        for (let i = offset; i < packed.positions.length; i += 3) {
            if (typeof packed.positions[i] === 'undefined') { continue; }
            let v = parseFloat(packed.positions[i]);
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

// scale_obj_positions = (packed) => {
//     console.log(packed);
//     return packed;
// };

// scale_obj_positions = (packed) => {
//     for (let offset = 0; offset < 2; ++offset) {
//         let min = 1e6, max = -1e6, sum = 0.0, n = 0;
//         for (let i = offset; i < packed.textures.length; i += 2) {
//             if (typeof packed.textures[i] === 'undefined') { continue; }
//             let v = parseFloat(packed.textures[i]);
//             min = Math.min(min, v);
//             max = Math.max(max, v);
//             sum = sum + v;
//             ++n;
//         }
//         for (let i = offset; i < packed.textures.length; i += 2) {
//             packed.textures[i] = (packed.textures[i] - min) / scale;
//         }
//     }
//     console.log(packed);
//     return packed;
// };
