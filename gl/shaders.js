// Vertex shader program

const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;
    
    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;
    
    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
        
        highp vec3 ambientLight = vec3(0.3, 0.3, 0.0);
        highp vec3 directionalLightColor = vec3(1, 0.5, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
    }
`;

// Fragment shader program

const fsSource = `
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;
    
    void main() {
        gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a); // vColor; // vec4(1.0, 1.0, 1.0, 1.0);
    }
`;