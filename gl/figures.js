const figuresConfig = [
    {
        program_id: "textured",
        surface: {
            type: "thor",
            params: [20, 4],
            // type: "sphere",
            // params: [20],
            // params: [2.7, 1],
            det: [100, 100],
        },
        on: true,
        // rotation: {
        //     angle: 0,
        //     vec: [1, 0, 0],
        //     speed: 1,
        // },
        texture_url: "textures/Lava_001_COLOR.png",
    },
    {
        program_id: "textured",
        surface: {
            type: "sphere",
            params: [40],
            det: [100, 100],
        },
        on: true,
        rotation: {
            angle: 0,
            vec: [0, 1, 0],
            speed: 0.05,
        },
        texture_url: "textures/Tiles_012_ROUGH.jpg",
    },
    {
        program_id: "textured",
        obj_name: "cerberus",
        on: true,
        rotation: {
            angle: 0,
            vec: [0, 1, 0],
            speed: -1,
        },
        start_translation: {
            vec: [0, 1, 0],
        },
        texture_url: "textures/grid_color.jpg",
    },
    {
        program_id: "textured",
        obj_name: "naruto",
        on: false,
        rotation: {
            angle: 0,
            vec: [0, 1, 0],
            speed: 0.5,
        },
        start_rotation: {
            angle: -0.5 * Math.PI,
            vec: [1, 0, 0],
        },
        texture_url: "textures/naruto_1.png",
    },
    {
        program_id: "textured",
        obj_name: "flash",
        on: false,
        rotation: {
            angle: 0,
            vec: [0, 1, 0],
            speed: 0.5,
        },
        texture_url: "textures/FL_CW_A_1.png",
    },
];


function build_figures(gl, figs_config) {
    const figures = [];
    for (let i = 0; i < figs_config.length; ++i) {
        const fig_config = figs_config[i];
        const figure = {
            programInfo: programs[fig_config.program_id],
            on: fig_config.on,
            rotation: fig_config.rotation,
            start_rotation: fig_config.start_rotation,
            start_translation: fig_config.start_translation,
            texture: loadTexture(gl, fig_config.texture_url),
        };
        let mesh = null;
        if (fig_config.obj_name) {
            mesh = mesh_from_obj(obj_meshes[fig_config.obj_name])
        }
        else if (fig_config.surface) {
            let surface_type = null;
            if (fig_config.surface.type === "thor") {
                surface_type = Thor;
            }
            else if (fig_config.surface.type === "sphere") {
                surface_type = Sphere;
            }
            const surface = new surface_type(...fig_config.surface.params);
            mesh = mesh_from_surface(surface, ...fig_config.surface.det);
        }

        figure.buffers = init_buffers(gl, mesh);

        figures.push(figure);
    }
    return figures;
}