function vec(vec_dict) {
    return vec3.fromValues(vec_dict.x, vec_dict.y, vec_dict.z);
}

class Sphere {
    constructor(r, center, inner) {
        this.r = r;
        this.center = center;
        this.inner = inner;
    }

    uv_range() {
        return {
            u_min: 0,
            u_max: 2 * Math.PI,
            v_min: - Math.PI / 2,
            v_max: Math.PI / 2,
        };
    }

    xyz(u, v) {
        const x = this.r * Math.cos(v) * Math.cos(u);
        const y = this.r * Math.cos(v) * Math.sin(u);
        const z = this.r * Math.sin(v);
        return {x: x + this.center.x, y: y + this.center.y, z: z + this.center.z};
    }

    nxyz(u, v) {
        const nx = Math.cos(v) * Math.cos(u);
        const ny = Math.cos(v) * Math.sin(u);
        const nz = Math.sin(v);
        if (this.inner) {
            return {x: nx, y: ny, z: nz};
        } else {
            return {x: -nx, y: -ny, z: -nz};
        }
    }

    du(u, v) {
        const dx_du = -Math.sin(u);
        const dy_du = Math.cos(u);
        const dz_du = 0;
        return {x: dx_du, y: dy_du, z: dz_du};
    }
    du_len(u, v) {
        return this.r * Math.cos(v);
    }

    dv(u, v) {
        const dx_dv = -Math.sin(v) * Math.cos(u);
        const dy_dv = -Math.sin(v) * Math.sin(u);
        const dz_dv = Math.cos(v);
        if (this.inner) {
            return {x: dx_dv, y: dy_dv, z: dz_dv};
        } else {
            return {x: -dx_dv, y: -dy_dv, z: -dz_dv};
        }
    }
    dv_len(u, v) {
        return this.r;
    }
}

class Thor {
    constructor(r_big, r_small, center, inner=false) {
        this.r_big = r_big;
        this.r_small = r_small;
        this.center = center;
        this.inner = inner;
    }

    uv_range() {
        return {
            u_min: 0, u_max: 2 * Math.PI,
            v_min: 0, v_max: 2 * Math.PI,
        }
    }

    xyz(u, v) {
        const x = (this.r_big + this.r_small * Math.cos(v)) * Math.cos(u);
        const y = (this.r_big + this.r_small * Math.cos(v)) * Math.sin(u);
        const z = this.r_small * Math.sin(v);
        return {x: x + this.center.x, y: y + this.center.y, z: z + this.center.z};
    }

    nxyz(u, v) {
        const nx = Math.cos(v) * Math.cos(u);
        const ny = Math.cos(v) * Math.sin(u);
        const nz = Math.sin(v);
        if (this.inner) {
            return {x: nx, y: ny, z: nz};
        } else {
            return {x: -nx, y: -ny, z: -nz};
        }
    }


    du(u, v) {
        const dx_du = -Math.sin(u);
        const dy_du = Math.cos(u);
        const dz_du = 0;
        return {x: dx_du, y: dy_du, z: dz_du};
    }
    du_len(u, v) {
        return this.r_big + this.r_small * Math.cos(v);
    }

    dv(u, v) {
        const dx_dv = -Math.sin(v) * Math.cos(u);
        const dy_dv = -Math.sin(v) * Math.sin(u);
        const dz_dv = Math.cos(v);
        if (this.inner) {
            return {x: dx_dv, y: dy_dv, z: dz_dv};
        } else {
            return {x: -dx_dv, y: -dy_dv, z: -dz_dv};
        }
    }
    dv_len(u, v) {
        return this.r_small;
    }
}

class Plane {
    constructor(r, inner) {
        this.r = r;
        this.inner = inner;
    }

    uv_range() {
        return {
            u_min: 0, u_max: 1,
            v_min: 0, v_max: 1,
        }
    }

    xyz(u, v) {
        const x = this.r * u;
        const y = this.r * v;
        const z = 0;
        return {x: x, y: y, z: z};
    }

    nxyz(u, v) {
        const nx = 0;
        const ny = 0;
        const nz = 1;
        if (this.inner) {
            return {x: nx, y: ny, z: nz};
        } else {
            return {x: -nx, y: -ny, z: -nz};
        }
    }

    du(u, v) {
        const dx_du = 1;
        const dy_du = 0;
        const dz_du = 0;
        return {x: dx_du, y: dy_du, z: dz_du};
    }
    du_len(u, v) {
        return this.r;
    }

    dv(u, v) {
        const dx_dv = 0;
        const dy_dv = 1;
        const dz_dv = 0;
        if (this.inner) {
            return {x: dx_dv, y: dy_dv, z: dz_dv};
        } else {
            return {x: -dx_dv, y: -dy_dv, z: -dz_dv};
        }
    }
    dv_len(u, v) {
        return this.r;
    }
}