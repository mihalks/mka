class Model {
    constructor() {
        this.data = [];
        this.width = 100;
        this.height = 100;
        this.D = 0.000001;
        this.h = 0.002;
        this.dt = 0.1;
        this.A = 0.25;
        this.uint8ca = [];

        this.calcA();
    }

    calcA() {
        this.A = this.D * (this.dt / this.h**2);
    }

    set_D(D) {
        this.D = parseFloat(D);
    }

    set_h(h) {
        this.h = parseFloat(h);
    }

    set_dt(dt) {
        this.dt = parseFloat(dt);
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.data = data;
    }

    getDataByCoords(j, i) {
        return this.data[i][j];
    }

    setWidth(width) {
        this.width = parseInt(width);
    }

    setHeight(height) {
        this.height = parseInt(height);
    }

    proccess(updateCanvas=false) {
        let buffer = this.data.slice();
        let dLeft, dRight, dBottom, dTop, siblings;

        this.uint8ca = [];

        for(let i = 0; i < this.height; i++) {
            for(let j = 0; j < this.width; j++) {
                
                if (buffer[i][j] >= 0 && buffer[i][j] <= 1) {

                    siblings = 4;
                    
                    dTop = i > 0 ? buffer[i-1][j] : 0; 
                    dBottom = i < this.height - 1  ? buffer[i+1][j] : 0; 

                    dLeft = j > 0 ? buffer[i][j-1] : 0; 
                    dRight = j < this.width - 1 ? buffer[i][j+1] : 0;
                    
                    dLeft = dLeft == 2 ? 0 : dLeft;
                    dRight = dRight == 2 ? 0 : dRight;
                    dTop = dTop == 2 ? 0 : dTop;
                    dBottom = dBottom == 2 ? 0 : dBottom;

                    dLeft = dLeft == 3 ? 1 : dLeft;
                    dRight = dRight == 3 ? 1 : dRight;
                    dTop = dTop == 3 ? 1 : dTop;
                    dBottom = dBottom == 3 ? 1 : dBottom;

                    siblings = !dLeft || !dRight ? siblings-1 : siblings;
                    siblings = !dTop || !dBottom ? siblings-1 : siblings;

                    dLeft = dLeft == -1 ? 0 : dLeft;
                    dRight = dRight == -1 ? 0 : dRight;
                    dTop = dTop == -1 ? 0 : dTop;
                    dBottom = dBottom == -1 ? 0 : dBottom;
                    
                    this.data[i][j] = buffer[i][j] + this.A*(dLeft + dRight + dBottom + dTop - siblings*buffer[i][j]);
                }

                if (updateCanvas) {
                    if (this.data[i][j] == 3) {
                        this.uint8ca.push(0);
                        this.uint8ca.push(0);
                        this.uint8ca.push(255);
                        this.uint8ca.push(255);
                    } else if (this.data[i][j] == 2) {
                        this.uint8ca.push(255);
                        this.uint8ca.push(0);
                        this.uint8ca.push(0);
                        this.uint8ca.push(255);
                    } else if (this.data[i][j] == -1) {
                        this.uint8ca.push(0);
                        this.uint8ca.push(128);
                        this.uint8ca.push(0);
                        this.uint8ca.push(255);
                    } else {
                        for (let n = 0; n < 3; n++) this.uint8ca.push(0);
                        this.uint8ca.push(this.data[i][j]*255);
                    }
                }
            }
        }

        dLeft = null; dRight = null; dTop = null; dBottom = null;
        buffer = null; 
    }
}