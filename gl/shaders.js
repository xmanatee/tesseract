// Vertex shader program
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;
    attribute vec2 aTextureCoord;
    
    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    // varying lowp vec4 vColor;
    varying highp vec3 vLighting;
    varying highp vec2 vTextureCoord;
    
    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        // vColor = aVertexColor;
        
        highp vec3 ambientLight = vec3(0.3, 0.3, 0.0);
        highp vec3 directionalLightColor = vec3(0.9, 0.3, 0.4);
        highp vec3 directionalVector = normalize(vec3(1, 0.5, 0.75));

        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
        vTextureCoord = aTextureCoord;
    }
`;

// Fragment shader program
const fsSource = `
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
