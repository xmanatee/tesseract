
function drawFigure(gl, figure) {
    gl.useProgram(figure.programInfo.program);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.getParameter(gl.VIEWPORT)[2] / gl.getParameter(gl.VIEWPORT)[3];
    const zNear = 0.1;
    const zFar = 400.0;

    const projectionMatrix = mat4.create();
    mat4.perspective(
        projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    const viewMatrix = player_view();
    const viewPosition = player_xyz();
    const modelMatrix = figure_view(figure);

    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);

    figure.buffers.attributes.forEach((attr) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, figure.buffers[attr.bufferName]);
        gl.vertexAttribPointer(
            figure.programInfo.attribLocations[attr.vertexAttributeName],
            attr.numComponents,
            attr.type,
            attr.normalize,
            attr.stride,
            attr.offset);
        gl.enableVertexAttribArray(
            figure.programInfo.attribLocations[attr.vertexAttributeName]);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    });


    gl.uniformMatrix4fv(
        figure.programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        figure.programInfo.uniformLocations.modelMatrix,
        false,
        modelMatrix);
    gl.uniformMatrix4fv(
        figure.programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
    gl.uniform3fv(
        figure.programInfo.uniformLocations.viewPosition,
        viewPosition);

    let figure_intensity = 1;
    const time_sec = new Date().getTime() / 1000.0;
    if (figure.intensity) {
        figure_intensity = figure.intensity.mean + figure.intensity.scale * Math.sin(2 * Math.PI * time_sec / figure.intensity.period);
    }

    gl.uniform1f(
        figure.programInfo.uniformLocations.uIntensity,
        figure_intensity);
    gl.uniform1f(
        figure.programInfo.uniformLocations.uTime,
        time_sec);

    if ("texture" in figure) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, figure.texture);
        gl.uniform1i(figure.programInfo.uniformLocations.uSampler, 0);
    }

    {
        const vertexCount = figure.buffers.numVertices;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, figure.buffers.indices);
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    // figure.buffers.attributes.forEach((attr) => {
    //     gl.disableVertexAttribArray(
    //         figure.programInfo.attribLocations[attr.vertexAttributeName]);
    // });

}
