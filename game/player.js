// const MAX_VELOCITY = 5;
// const MAX_TURN = 0.003;
// const MAX_LAT = 1;

class Player {

    constructor(x, y, view_lat, view_lon, key_triggers) {
        this.x = x;
        this.y = y;
        this.view_lat = view_lat;
        this.view_lon = view_lon;

        this.stright_velocity = 0;
        this.side_velocity = 0;

        key_triggers['W'] = () => {this.forwardStart();};
        key_triggers['S'] = () => {this.backStart();};
        key_triggers['A'] = () => {this.leftStart();};
        key_triggers['D'] = () => {this.rightStart();};

        // console.log("init", this.stright_velocity, this.side_velocity, this.x, this.y);

    }

    get position() {
        return [this.y, 0, this.x];
    }

    get sideAxis() {
        return [Math.cos(this.view_lon), 0, Math.sin(this.view_lon)]
    }

    move(deltaTime) {
        this.x += (Math.cos(this.view_lon) * this.stright_velocity + Math.sin(this.view_lon) * this.side_velocity) * deltaTime;
        this.y += (-Math.sin(this.view_lon) * this.stright_velocity + Math.cos(this.view_lon) * this.side_velocity) * deltaTime;
    }

    forwardStart() {
        this.stright_velocity = MAX_VELOCITY;
        // console.log("forward", this.stright_velocity, this.side_velocity, this.x, this.y);
    }
    backStart() {
        this.stright_velocity = -MAX_VELOCITY;
        // console.log("back", this.stright_velocity, this.side_velocity, this.x, this.y);
    }
    strightStop() {
        this.stright_velocity = 0;
    }
    leftStart() {
        this.side_velocity = MAX_VELOCITY;
        // console.log("left", this.stright_velocity, this.side_velocity, this.x, this.y);
    }
    rightStart() {
        this.side_velocity = -MAX_VELOCITY;
        // console.log("right", this.stright_velocity, this.side_velocity, this.x, this.y);
    }
    sideStop() {
        this.side_velocity = 0;
    }
    moveStop() {
        this.stright_velocity = 0;
        this.side_velocity = 0;
    }

    moveView(d_lat, d_lon) {
        this.view_lat += MAX_TURN * d_lat;
        if (this.view_lat > MAX_LAT) {
            this.view_lat = MAX_LAT;
        } else if (this.view_lat < -MAX_LAT) {
            this.view_lat = -MAX_LAT;
        }
        this.view_lon += MAX_TURN * d_lon;
    }



}