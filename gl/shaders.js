// Vertex shader program
const vertexShader = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;
    attribute vec2 aTextureCoord;
    
    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;
    varying highp vec2 vTextureCoord;
    
    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
        
        highp vec3 ambientLight = vec3(0.3, 0.3, 0.0);
        // highp vec3 directionalLightColor = vec3(0.9, 0.3, 0.4);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(1, 0.5, 0.75));

        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
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
