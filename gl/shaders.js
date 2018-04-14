// Vertex shader program
const vertexShader = `
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;
    attribute vec2 aTextureCoord;
    
    uniform mat4 uViewMatrix;
    uniform vec3 uViewPosition;
    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;
    // uniform float uScale;
    
    varying highp vec3 vLighting;
    varying highp vec2 vTextureCoord;
    
    // constants:
    highp vec3 ambientLight = vec3(0.1, 0.1, 0.1);
    highp vec3 lightColor_1 = vec3(1.5, 0.5, 0.0);
    highp vec3 lightColor_2 = vec3(0, 2, 2.4);
    highp vec3 lightPos_1 = -100.0 * vec3(1, 0.5, 0.75);
    highp vec3 lightPos_2 = -100.0 * vec3(-1, -0.5, 0);
    float specularStrength = 0.5;
    float specularDensity = 100000.0;

    void main() {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1); // * vec4(uScale, uScale, uScale, 1);
                
        highp vec3 lightDir_1 = normalize(lightPos_1 - aVertexPosition);
        highp vec3 lightDir_2 = normalize(lightPos_2 - aVertexPosition);
        highp vec3 viewDir = normalize(uViewPosition - aVertexPosition);
        highp vec3 reflectLightDir_1 = reflect(-lightDir_1, aVertexNormal);
        highp vec3 reflectLightDir_2 = reflect(-lightDir_2, aVertexNormal);

        highp vec3 diffuseLight_1 = lightColor_1 * max(dot(aVertexNormal.xyz, lightDir_1), 0.0);
        highp vec3 diffuseLight_2 = lightColor_2 * max(dot(aVertexNormal.xyz, lightDir_2), 0.0);

        
        float lightSpec_1 = pow(max(dot(viewDir, reflectLightDir_1), 0.0), specularDensity);
        vec3 specularLight_1 = specularStrength * lightSpec_1 * lightColor_1;

        float lightSpec_2 = pow(max(dot(viewDir, reflectLightDir_2), 0.0), specularDensity);
        vec3 specularLight_2 = specularStrength * lightSpec_2 * lightColor_2;
        
        vLighting = ambientLight
            + diffuseLight_1
            + diffuseLight_2
            + specularLight_1;
        vTextureCoord = aTextureCoord;
    }
`;

// Fragment shader program
const textureFragmentShader = `
    varying highp vec3 vLighting;
    varying highp vec2 vTextureCoord;
    
    uniform sampler2D uSampler;

    void main() {
        highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
        
        gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
`;

// // Fragment shader program
// const colorFragmentShader = `
//     varying lowp vec4 vColor;
//     varying highp vec3 vLighting;
//
//     void main() {
//         highp vec4 texelColor = vColor;
//
//         gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
//     }
// `;


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
