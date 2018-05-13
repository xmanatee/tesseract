function multiMesh(meshes) {
    let result_mesh = {
        positions: [],
        normals: [],
        textures: [],
        colors: [],
        elements: [],
    };

    for (let i = 0; i < meshes.length; i++) {
        const mesh = meshes[i];
        const elements_offset = result_mesh.positions.length / 3;

        result_mesh.positions = result_mesh.positions.concat(mesh.positions);
        result_mesh.normals = result_mesh.normals.concat(mesh.normals);
        result_mesh.textures = result_mesh.textures.concat(mesh.textures);
        result_mesh.colors = result_mesh.colors.concat(mesh.colors);
        result_mesh.elements = result_mesh.elements.concat(mesh.elements.map(function (id) {
            return id + elements_offset;
        }));
    }

    return result_mesh;
}
