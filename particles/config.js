const particles = {
    consts: {
        num_instances: 10,
        program: {
            transform: 0,
            draw: 1,
        },
        location: {
            offset: 0,
            velocity: 1,
            position: 2,
            color: 3,
            mass: 4,
            num: 5,
        }
    },
    vars: {
        is_pushed: false,
        last_update: 0,
        magnet_push_min: 1.7,
        magnet_push: 15.0,
        currentSourceId: 0,
    }
};
