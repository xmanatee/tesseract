function vec4d(vec_dict) {
    return vec4.fromValues(vec_dict.x, vec_dict.y, vec_dict.z, vec_dict.q);
}


class Thor4d {
    constructor(r_1, r_2, r_3, inner=false) {
        this.is4d = true;

        this.r_1 = r_1;
        this.r_2 = r_2;
        this.r_3 = r_3;
        this.inner = inner;
    }

    wuv_range() {
        return {
            w_min: 0, w_max: 2 * Math.PI,
            u_min: 0, u_max: 2 * Math.PI,
            v_min: 0, v_max: 2 * Math.PI,
        }
    }

    xyzq(w, u, v) {
        const x = (this.r_1 + (this.r_2 + this.r_3 * Math.cos(v)) * Math.cos(u)) * Math.cos(w);
        const y = (this.r_1 + (this.r_2 + this.r_3 * Math.cos(v)) * Math.cos(u)) * Math.sin(w);
        const z = (this.r_2 + this.r_3 * Math.cos(v)) * Math.sin(u);
        const q = this.r_3 * Math.sin(v);
        return {x: x, y: y, z: z, q: q};
    }

    nxyzq(w, u, v) {
        const nx = Math.cos(v) * Math.cos(u) * Math.cos(w);
        const ny = Math.cos(v) * Math.cos(u) * Math.sin(w);
        const nz = Math.cos(v) * Math.sin(u);
        const nq = Math.sin(v);
        if (this.inner) {
            return {x: nx, y: ny, z: nz, q: nq};
        } else {
            return {x: -nx, y: -ny, z: -nz, q: -nq};
        }
    }


    dw(w, u, v) {
        const dx_dw = -Math.sin(w);
        const dy_dw = Math.cos(w);
        const dz_dw = 0;
        const dq_dw = 0;
        return {x: dx_dw, y: dy_dw, z: dz_dw, q: dq_dw};
    }
    dw_len(w, u, v) {
        return (this.r_1 + (this.r_2 + this.r_3 * Math.cos(v)) * Math.cos(u));
    }

    du(w, u, v) {
        const dx_du = -Math.sin(u) * Math.cos(w);
        const dy_du = -Math.sin(u) * Math.sin(w);
        const dz_du = -Math.sin(u);
        const dq_du = 0;
        if (this.inner) {
            return {x: dx_du, y: dy_du, z: dz_du, q: dq_du};
        } else {
            return {x: -dx_du, y: -dy_du, z: -dz_du, q: -dq_du};
        }
    }
    du_len(w, u, v) {
        return this.r_2 + this.r_3 * Math.cos(v);
    }

    dv(w, u, v) {
        const dx_dv = -this.r_3 * Math.sin(v) * Math.cos(u) * Math.cos(w);
        const dy_dv = -this.r_3 * Math.sin(v) * Math.cos(u) * Math.sin(w);
        const dz_dv = -this.r_3 * Math.sin(v) * Math.sin(u);
        const dq_dv = this.r_3 * Math.cos(v);
        if (this.inner) {
            return {x: dx_dv, y: dy_dv, z: dz_dv, q: dq_dv};
        } else {
            return {x: -dx_dv, y: -dy_dv, z: -dz_dv, q: -dq_dv};
        }
    }
    dv_len(w, u, v) {
        return this.r_3;
    }
}
