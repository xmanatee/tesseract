//***************
//** CONSTANTS **
//***************

const lights_FragmentShaderConstants = `
    const highp vec3 RGB_BLACK = vec3(0);
    const highp vec3 RGB_WHITE = vec3(1);

    const highp vec3 ambientLight = vec3(0.1, 0.1, 0.1);

    const highp vec3 lightPos_1 = -100.0 * vec3(0.75, 0.3, 0.6);
    const highp vec3 lightColor_1 = 2.3 * vec3(0.8, 0.2, 0.0);

    const highp vec3 lightPos_2 = -100.0 * vec3(-1, -0.5, 0);
    const highp vec3 lightColor_2 = 2.3 * vec3(0, 0.2, 0.8);

    const highp float lightSpecularStrength = 0.75;
    const highp float lightSpecularShininess = 150.0;
`.trim();



//**************
//** FUNCTION **
//**************

const base_FragmentShaderFunction = `
    highp float toFraction(in float number, in float denominator) {
        return floor(number * denominator) / denominator;
    }

    highp float distToFraction(in float number, in float denominator) {
        return abs(toFraction(number, denominator) - number);
    }
`.trim();

const pulsateColor_FragmentShaderFunction = `
    uniform highp float uIntensity;

    vec3 pulsateColor(in vec3 rgb_color) {
        highp vec3 pulsation_vec = vec3(uIntensity);
        return(rgb_color * pulsation_vec);
    }
`.trim();

const compileLight_FragmentShaderFunction = `
    highp vec3 compileLight(
            in vec3 viewDir,
            in vec3 vVertexPosition,
            in vec3 vVertexNormal,
            in vec3 lightPos,
            in vec3 lightColor,
            in float lightSpecularStrength,
            in float lightSpecularShininess) {
        highp vec3 lightDir = normalize(lightPos - vVertexPosition);
        highp vec3 reflectLightDir = reflect(-lightDir, vVertexNormal);

        highp vec3 diffuseLight = lightColor * max(dot(vVertexNormal, lightDir), 0.0);

        highp float lightSpec = pow(max(dot(viewDir, reflectLightDir), 0.0), lightSpecularShininess);
        highp vec3 specularLight = lightSpecularStrength * lightSpec * lightColor;

        return(diffuseLight + specularLight);
    }
`.trim();

const normalGetColor_FragmentShaderFunction = `
    highp vec4 getColor(in vec3 vVertexNormal, in vec2 vTextureCoord) {
        highp vec4 color = vec4(vVertexNormal, 1);
        return(color);
    }
`.trim();

const whiteGetColor_FragmentShaderFunction = `
    highp vec4 getColor(in vec3 vVertexNormal, in vec2 vTextureCoord) {
        return(vec4(RGB_WHITE, 1));
    }
`.trim();

const textureGetColor_FragmentShaderFunction = `
    uniform sampler2D uSampler;

    highp vec4 getColor(in vec3 vVertexNormal, in vec2 vTextureCoord) {
        highp vec4 color = texture2D(uSampler, vTextureCoord);
        return(color);
    }
`.trim();

const globusGetColor_FragmentShaderFunction = `
    const lowp float globusNumSplits = 10.0;
    const highp float globusBorderRadius = 0.01;

    highp vec4 getColor(in vec3 vVertexNormal, in vec2 vTextureCoord) {
        if (distToFraction(vTextureCoord.x, globusNumSplits) < globusBorderRadius
                || distToFraction(vTextureCoord.y, globusNumSplits) < globusBorderRadius) {
            return(vec4(RGB_BLACK, 1));
        } else {
            return(vec4(RGB_WHITE, 1));
        }
    }
`.trim();

const toonifyFinalizeColor_FragmentShaderFunction = `
    const highp float numTones = 2.0;
    const highp float toonBorderRadius = 0.007;

    highp vec4 finalizeColor(in vec4 color) {
        if (distToFraction(color.r, numTones) < toonBorderRadius
                || distToFraction(color.g, numTones) < toonBorderRadius
                || distToFraction(color.b, numTones) < toonBorderRadius) {
            return(vec4(RGB_BLACK, 1));
        }
        return(vec4(
            toFraction(color.r, numTones),
            toFraction(color.g, numTones),
            toFraction(color.b, numTones),
            color.a));
    }
`.trim();

const emptyFinalizeColor_FragmentShaderFunction = `
    highp vec4 finalizeColor(in vec4 color) {
        return(color);
    }
`.trim();



//********************
//** VERTEX SHADERS **
//********************

const usualVertexShader = `
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying highp vec3 vVertexNormal;
    varying highp vec3 vVertexPosition;
    varying highp vec2 vTextureCoord;

    void main() {
        highp vec3 vertexPosition = aVertexPosition;
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(vertexPosition, 1);
        
        vTextureCoord = aTextureCoord;
        vVertexNormal = mat3(uModelMatrix) * aVertexNormal;
        vVertexPosition = vertexPosition;
    }
`.trim();



//**********************
//** FRAGMENT SHADERS **
//**********************

const fragmentShaderTemplate = `
    varying highp vec3 vVertexPosition;
    varying highp vec3 vVertexNormal;
    varying highp vec2 vTextureCoord;

    uniform highp vec3 uViewPosition;

    void main() {
        highp vec4 color = getColor(vVertexNormal, vTextureCoord);
        highp vec3 viewDir = normalize(uViewPosition - vVertexPosition);
        
        highp vec3 lighting = ambientLight
            + compileLight(
                viewDir, vVertexPosition, vVertexNormal, lightPos_1, lightColor_1, lightSpecularStrength, lightSpecularShininess)
            + compileLight(
                viewDir, vVertexPosition, vVertexNormal, lightPos_2, lightColor_2, lightSpecularStrength, lightSpecularShininess);
        
        highp vec4 finalColor = vec4(color.rgb * lighting, color.a);
        
        gl_FragColor = finalizeColor(finalColor);
    }
`.trim();



//**********************
//** FRAGMENT SHADERS **
//**********************

function compileFragmentShader(getColorType, finalizeColorType) {
    let fragmentShader = lights_FragmentShaderConstants
        + base_FragmentShaderFunction
        + compileLight_FragmentShaderFunction;

    if (getColorType === "globus") {
        fragmentShader += globusGetColor_FragmentShaderFunction;
    } else if (getColorType === "normal") {
        fragmentShader += normalGetColor_FragmentShaderFunction;
    } else if (getColorType === "texture") {
        fragmentShader += textureGetColor_FragmentShaderFunction;
    } else if (getColorType === "white") {
        fragmentShader += whiteGetColor_FragmentShaderFunction;
    } else {
        console.log("Wrong getColorType.");
        return null;
    }

    if (finalizeColorType === "toon") {
        fragmentShader += toonifyFinalizeColor_FragmentShaderFunction;
    } else if (finalizeColorType === "empty") {
        fragmentShader += emptyFinalizeColor_FragmentShaderFunction;
    } else {
        console.log("Wrong finalizeColorType.");
        return null;
    }

    fragmentShader += fragmentShaderTemplate;

    return fragmentShader;
}

const globusFragmentShader = compileFragmentShader("white", "toon");

const looneyFragmentShader = compileFragmentShader("texture", "empty");

const rgbNormalFragmentShader = compileFragmentShader("normal", "empty");



//******************************************
//** TEMPLATE **
//******************************************
