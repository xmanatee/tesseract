const vs_transform_shader = `
    #version 300 es
    #define OFFSET_LOCATION 0
    #define VELOCITY_LOCATION 1
    #define MASS_LOCATION 4
    
    #define MAGNET_G 0.8
    #define MAGNET_RADIUS 0.2
    #define MIN_VELOCITY 0.0
    #define MAX_VELOCITY 3.2
    
    precision highp float;
    precision highp int;

    uniform float u_dtime;
    uniform vec3 u_magnet_center;

    layout(location = OFFSET_LOCATION) in vec3 a_offset;
    layout(location = VELOCITY_LOCATION) in vec3 a_velocity;
    layout(location = MASS_LOCATION) in float a_mass;

    out vec3 v_offset;
    out vec3 v_velocity;
    
    float rand(vec3 co){
        return fract(sin(dot(co.xyz ,vec3(12.9898, 78.233, 48.1516))) * 43758.5453);
    }
    
    void main()
    {
        vec3 random3 = vec3(
            rand(2.0 * a_mass * a_offset),
            rand(3.0 * a_mass * a_offset),
            rand(4.0 * a_mass * a_offset)
        );
        // v_velocity = a_velocity;
        vec3 offset = a_offset;

        vec3 r = offset + u_magnet_center;
        float dist2surf = length(r) - MAGNET_RADIUS;
        vec3 vec2surf = dist2surf * r / length(r);
        vec3 a = -normalize(vec2surf) * MAGNET_G * a_mass * pow(dist2surf * 1000.0, 2.0)
            // * (exp(1.0 * length(dist2surf)) + exp(-1.0 * length(dist2surf)))
            + random3 * 2.9;
            ;
        v_velocity = a_velocity + u_dtime * a;

        float v_velocity_len = length(v_velocity);
        v_velocity = normalize(v_velocity) * clamp(v_velocity_len, MIN_VELOCITY, MAX_VELOCITY); 
        v_offset = offset + u_dtime * v_velocity;

        // gl_Position = vec4(v_offset, 1.0);
    }
`.trim();

// UNUSED
const fs_transform_shader = `
    #version 300 es
    void main()
    {
    }
`.trim();

const vs_draw_shader = `
    #version 300 es
    #define OFFSET_LOCATION 0
    #define VELOCITY_LOCATION 1
    #define POSITION_LOCATION 2
    #define COLOR_LOCATION 3

    precision highp float;
    precision highp int;

    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;

    layout(location = POSITION_LOCATION) in vec2 a_position;
    layout(location = VELOCITY_LOCATION) in vec3 a_velocity;
    layout(location = OFFSET_LOCATION) in vec3 a_offset;
    layout(location = COLOR_LOCATION) in vec3 a_color;

    out vec3 v_color;

    void main()
    {
        vec3 offset = a_offset;
        vec4 offset4d = uProjectionMatrix * uViewMatrix * vec4(offset, 1);
        offset = vec3(offset4d) / offset4d.w;

        v_color = a_color;
        vec3 nvelocity = normalize(a_velocity);

        float cos_r = nvelocity.x;
        float sin_r = nvelocity.y;

        mat2 rot = mat2(
            cos_r, sin_r,
            -sin_r, cos_r
        );
        gl_Position = vec4(vec3(rot * a_position, 0.0) / length(offset4d) + offset, 1.0);
    }
`.trim();

const fs_draw_shader = `
        #version 300 es
        #define ALPHA 0.7

        precision highp float;
        precision highp int;

        in vec3 v_color;

        out vec4 color;

        void main()
        {
            color = vec4(v_color * ALPHA, ALPHA);
        }
`.trim();
