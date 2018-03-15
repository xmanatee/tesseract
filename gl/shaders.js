// Vertex shader program
const vertexShader = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;
    attribute vec2 aTextureCoord;
    
    uniform mat4 uNormalMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;
    varying highp vec2 vTextureCoord;
    
    void main() {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
        vColor = aVertexColor;
        
        highp vec3 ambientLight = vec3(0.1, 0.1, 0.1);


        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

        highp vec3 directionalLightColor_1 = vec3(1.5, 0.5, 0.0);
        highp vec3 directionalVector_1 = normalize(vec3(1, 0.5, 0.75));
        highp float directional_1 = max(dot(transformedNormal.xyz, directionalVector_1), 0.0);

        highp vec3 directionalLightColor_2 = vec3(0, 2, 2.4);
        highp vec3 directionalVector_2 = normalize(vec3(-1, -0.5, 0));
        highp float directional_2 = max(dot(transformedNormal.xyz, directionalVector_2), 0.0);


        vLighting = ambientLight + (directionalLightColor_1 * directional_1) + (directionalLightColor_2 * directional_2);;
        vTextureCoord = aTextureCoord;
    }
`;

// Fragment shader program
const textureFragmentShader = `
    // varying lowp vec4 vColor;
    varying highp vec3 vLighting;
    varying highp vec2 vTextureCoord;
    
    uniform sampler2D uSampler;

    void main() {
        // highp vec4 texelColor = vColor;
        highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
        
        gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
`;

// Fragment shader program
const colorFragmentShader = `
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;
    varying highp vec2 vTextureCoord;
    
    uniform sampler2D uSampler;

    void main() {
        highp vec4 texelColor = vColor;
        // highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
        
        gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
`;


function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
