
const programs = {};

function init_programs(gl) {

    // let shaderProgram = null;

    // let shaderProgram = initShaderProgram(gl, vertexShader, colorFragmentShader);
    // programs.colored = {
    //     program: shaderProgram,
    //     attribLocations: {
    //         vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    //         // textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    //         vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
    //         vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    //     },
    //     uniformLocations: {
    //         projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
    //         viewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
    //         modelMatrix: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
    //         normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
    //         // uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    //     },
    // };

    let shaderProgram = initShaderProgram(gl, vertexShader, textureFragmentShader);
    programs.textured = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            // vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            viewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
            viewPosition: gl.getUniformLocation(shaderProgram, 'uViewPosition'),
            modelMatrix: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
            // uScale: gl.getUniformLocation(shaderProgram, 'uScale'),
        },
    };
}
