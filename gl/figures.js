const figuresConfig = [
    // {
    //     id: "thor",
    //     program_id: "textured",
    //     surface: {
    //         type: "thor",
    //         params: [8, 5],
    //         // type: "sphere",
    //         // params: [8],
    //         det: [100, 100],
    //     },
    //     on: true,
    //     // rotation: {
    //     //     angle: 0,
    //     //     vec: [1, 0, 0],
    //     //     speed: 1,
    //     // },
    //     texture_url: "textures/Lava_001_COLOR.png",
    // },
    {
        id: "thor4d",
        program_id: "textured",
        surface: {
            type: "thor4d",
            params: [10, 5.25, 3],
            det: [20, 20, 20],
        },
        intensity: {
            mean: 2.5,
            scale: 1.5,
            period: 4.0,
        },
        on: true,
        texture_url: "textures/Lava_001_COLOR.png",
    },
    {
        id: "sphere",
        program_id: "textured",
        surface: {
            type: "sphere",
            params: [40],
            det: [200, 200],
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
        id: "cerberus",
        program_id: "textured",
        obj: {
            name: "cerberus",
            scale: 0.1,
        },
        on: true,
        relative: true,
        start_translation: {
            vec: [0.05, -0.035, -0.2],
        },
        texture_url: "textures/grid_color.jpg",
    },
    {
        id: "naruto",
        program_id: "textured",
        obj: {
            name: "naruto",
            scale: 1,
        },
        on: true,
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
        id: "flash",
        program_id: "textured",
        obj: {
            name: "flash",
            // scale: 1,
        },
        rotation: {
            angle: 0,
            vec: [0, 1, 0],
            speed: 0.5,
        },
        on: false,
        // relative: true,
        // start_rotation: {
        //     angle: -3,
        //     vec: [0, 1, 0],
        // },
        // start_translation: {
        //     vec: [0, -0.15, -0.5],
        // },
        texture_url: "textures/FL_CW_A_1.png",
    },
];


function build_figures(gl, figs_config) {
    const figures = [];
    for (let i = 0; i < figs_config.length; ++i) {
        const fig_config = figs_config[i];
        const figure = {
            id: fig_config.id,
            programInfo: programs[fig_config.program_id],
            on: fig_config.on,
            relative: fig_config.relative,
            rotation: fig_config.rotation,
            intensity: fig_config.intensity,
            start_rotation: fig_config.start_rotation,
            start_translation: fig_config.start_translation,
            texture: loadTexture(gl, fig_config.texture_url),
        };
        let mesh = null;
        if (fig_config.obj) {
            mesh = mesh_from_obj(obj_meshes[fig_config.obj.name], fig_config.obj.scale)
        }
        else if (fig_config.surface) {
            let surface_type = null;
            if (fig_config.surface.type === "thor") {
                surface_type = Thor;
            }
            else if (fig_config.surface.type === "thor4d") {
                surface_type = Thor4d;
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

function figure_view(figure) {
    let modelMatrix = null;
    if (figure.relative) {
        modelMatrix = player_view();
        mat4.invert(modelMatrix, modelMatrix);
    } else {
        modelMatrix = mat4.create();
    }

    if (figure.rotation) {
        mat4.rotate(
            modelMatrix,
            modelMatrix,
            figure.rotation.angle,
            figure.rotation.vec);
    }
    if (figure.start_translation) {
        mat4.translate(
            modelMatrix,
            modelMatrix,
            figure.start_translation.vec);
    }
    if (figure.start_rotation) {
        mat4.rotate(
            modelMatrix,
            modelMatrix,
            figure.start_rotation.angle,
            figure.start_rotation.vec);
    }

    return modelMatrix;
}