// Vertex shader program
const vertexShader = `
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;
    attribute vec2 aTextureCoord;
    
    // uniform mat4 uViewMatrix;
    // uniform vec3 uViewPosition;
    // uniform mat4 uModelMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    // uniform float uScale;
    
    varying highp vec3 vVertexNormal;
    varying highp vec3 vVertexPosition;
    varying highp vec2 vTextureCoord;

    void main() {
        highp vec3 vertexPosition = aVertexPosition;
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(vertexPosition, 1); // * vec4(uScale, uScale, uScale, 1);
        
        vTextureCoord = aTextureCoord;
        vVertexNormal = aVertexNormal;
        vVertexPosition = vertexPosition;
    }
`;

// Fragment shader program
const textureFragmentShader = `

    varying highp vec3 vVertexNormal;
    varying highp vec3 vVertexPosition;
    varying highp vec2 vTextureCoord;
    
    uniform sampler2D uSampler;
    uniform highp vec3 uViewPosition;
    uniform highp float uIntensity;
    uniform highp float uTime;
    
    // Lighting constants:
    const highp vec3 ambientLight = vec3(0.1, 0.1, 0.1);
    const highp vec3 lightColor_1 = vec3(0.8, 0.2, 0.0);
    const highp vec3 lightColor_2 = vec3(0, 0.2, 0.8);
    const highp vec3 lightPos_1 = -100.0 * vec3(0.75, 0.3, 0.6);
    const highp vec3 lightPos_2 = -100.0 * vec3(-1, -0.5, 0);
    const highp float specularStrength = 0.5;
    const highp float specularDensity = 256.0;

    void main() {
        highp vec3 pulsation_vec = vec3(uIntensity, 1, 1);
        highp vec4 color = texture2D(uSampler, vTextureCoord);
        // highp float redColor = color.r;
                
        highp vec3 lightDir_1 = normalize(lightPos_1 - vVertexPosition);
        highp vec3 lightDir_2 = normalize(lightPos_2 - vVertexPosition);
        highp vec3 viewDir = normalize(uViewPosition - vVertexPosition);
        highp vec3 reflectLightDir_1 = reflect(lightDir_1, vVertexNormal);
        highp vec3 reflectLightDir_2 = reflect(lightDir_2, vVertexNormal);

        highp vec3 diffuseLight_1 = lightColor_1 * max(dot(vVertexNormal, lightDir_1), 0.0);
        highp vec3 diffuseLight_2 = lightColor_2 * max(dot(vVertexNormal, lightDir_2), 0.0);

        highp float lightSpec_1 = pow(max(dot(viewDir, reflectLightDir_1), 0.0), specularDensity);
        highp vec3 specularLight_1 = specularStrength * lightSpec_1 * lightColor_1;

        highp float lightSpec_2 = pow(max(dot(viewDir, reflectLightDir_2), 0.0), specularDensity);
        highp vec3 specularLight_2 = specularStrength * lightSpec_2 * lightColor_2;
        
        highp vec3 lighting = ambientLight
            + diffuseLight_1
            + diffuseLight_2
            + specularLight_1
            + specularLight_2;
        
        gl_FragColor = vec4(pulsation_vec * color.rgb * lighting, color.a);
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
