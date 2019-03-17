
const programs = {};

function init_programs(gl) {

    let shaderProgram = null;

    shaderProgram = initShaderProgram(gl, usualVertexShader, rgbNormalFragmentShader);
    programs.rgbNormal = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelMatrix: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
            viewPosition: gl.getUniformLocation(shaderProgram, 'uViewPosition'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
            uIntensity: gl.getUniformLocation(shaderProgram, 'uIntensity'),
            uTime: gl.getUniformLocation(shaderProgram, 'uTime'),
        },
    };

    shaderProgram = initShaderProgram(gl, usualVertexShader, looneyFragmentShader);
    programs.looney = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            // vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelMatrix: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
            // viewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
            viewPosition: gl.getUniformLocation(shaderProgram, 'uViewPosition'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
            uIntensity: gl.getUniformLocation(shaderProgram, 'uIntensity'),
            uTime: gl.getUniformLocation(shaderProgram, 'uTime'),
            // uScale: gl.getUniformLocation(shaderProgram, 'uScale'),
        },
    };

    shaderProgram = initShaderProgram(gl, usualVertexShader, globusFragmentShader);
    programs.globus = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            // vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelMatrix: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
            // viewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
            viewPosition: gl.getUniformLocation(shaderProgram, 'uViewPosition'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
            uIntensity: gl.getUniformLocation(shaderProgram, 'uIntensity'),
            uTime: gl.getUniformLocation(shaderProgram, 'uTime'),
            // uScale: gl.getUniformLocation(shaderProgram, 'uScale'),
        },
    };
}
