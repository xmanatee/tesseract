
const figuresConfig = [
    // {
    //     id: "thor",
    //     program_id: "looney",
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
        program_id: "rgbNormal",
        surface: {
            type: "thor4d",
            params: [10, 5.25, 3],
            det: [10, 10, 10],
            plane: [
                [-0.2655017212625049, -0.32561684101612254, -0.42738505389211257, -0.8005151619819302],
                [0.5346068036522923, 0.7334102640848212, -0.2118175608212149, -0.36254416413928103],
                [-0.7947356743813667, 0.5933143317483519, 0.12078623129127208, -0.042237399754749536],
                [0.10999822435346986, -0.06372724004460116, 0.8705664954314646, -0.4753453550288956],
            ],
            plane_base: [0, 0, 0, 0],
        },
        intensity: {
            mean: 3.5,
            scale: 1.0,
            period: 3.0,
        },
        on: true,
        texture_url: "resources/textures/Lava_001_COLOR.png",
    },
    {
        id: "sphere",
        program_id: "globus",
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
        texture_url: "resources/textures/Tiles_012_ROUGH.jpg",
    },
    {
        id: "cerberus",
        program_id: "looney",
        obj: {
            name: "cerberus",
            scale: 0.1,
        },
        on: true,
        relative: true,
        start_translation: {
            vec: [0.05, -0.035, -0.2],
        },
        texture_url: "resources/textures/grid_color.jpg",
    },
    {
        id: "naruto",
        program_id: "looney",
        obj: {
            name: "naruto",
            // scale: 1.0,
        },
        on: true,
        rotation: {
            angle: 0,
            vec: [0, 0, 1],
            speed: 0.3,
        },
        texture_url: "resources/textures/naruto_1.png",
    },
    {
        id: "flash",
        program_id: "looney",
        obj: {
            name: "flash",
            // scale: 1,
        },
        rotation: {
            angle: 0,
            vec: [0, 0, 1],
            speed: 0.3,
        },
        on: false,
        // relative: true,
        start_rotation: {
            angle: 0.5 * Math.PI,
            vec: [1, 0, 0],
        },
        // start_translation: {
        //     vec: [0, -0.15, -0.5],
        // },
        texture_url: "resources/textures/FL_CW_A_1.png",
    },
    {
        id: "hand",
        program_id: "looney",
        obj: {
            name: "hand",
            scale: 0.07,
        },
        on: true,
        relative: true,
        start_rotation: [
            {
                angle: -0.5 * Math.PI,
                vec: [1, 0, 0],
            },
            {
                angle: -0.8 * Math.PI,
                vec: [0, 1, 0],
            },
            {
                angle: -0.1 * Math.PI,
                vec: [0, 0, 1],
            },
            {
                angle: 0.05 * Math.PI,
                vec: [1, 0, 0],
            },
        ],
        start_translation: {
            vec: [-0.07, -0.035, -0.17],
        },
        texture_url: "resources/objs/hand/hand.png",
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
            mesh = mesh_from_obj_str(obj_meshes[fig_config.obj.name], fig_config.obj.scale)
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
            figure.surface = fig_config.surface;
            figure.surface_instance = surface;
            mesh = mesh_from_surface(
                surface,
                fig_config.surface.det,
                fig_config.surface.plane,
                fig_config.surface.plane_base
            );
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
        if (figure.start_rotation instanceof Array) {
            for (let i = 0; i < figure.start_rotation.length; ++i) {
                mat4.rotate(
                    modelMatrix,
                    modelMatrix,
                    figure.start_rotation[i].angle,
                    figure.start_rotation[i].vec);
            }
        } else {
            mat4.rotate(
                modelMatrix,
                modelMatrix,
                figure.start_rotation.angle,
                figure.start_rotation.vec);
        }
    }

    return modelMatrix;
}