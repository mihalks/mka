class CanvasHandler {
    constructor(el) {
        this.data = [];

        this.ctx = el.getContext('2d');
        this.statusbar = el.parentElement.querySelector('#status');

        this.currPos = {X: 0, Y: 0};
        this.prevPos = {X: 0, Y: 0};
        this.startPos = {X: 0, Y: 0};
        this.mouseVal = 0;
        this.isMouseDown = 0;
        this.ctrlDown = 0;
        this.shiftDown = 0;

        this.chartPoint = {};

        this.concentrat = 1;
        this.filling = false;
        this.tool = 'pen';
        this.line_width = 1;

        this._init();
        this._setMouseHandlers();

        this.setEditorMode('source');
    }

    setActiveTool(tool) {
        this.tool = tool;
    }

    setFilling(fill) {
        this.filling = Boolean(fill);
    }

    setBrushType(type) {
        this.ctx.lineCap = ['round', 'square'].includes(type) ? type : 'round';
    }

    setBrushSize(size) {
        this.line_width = parseInt(size);
        this.ctx.lineWidth = this.line_width;
    }
    
    setStartConcentrat(concentrat) {
        this.concentrat = ~~(parseFloat(concentrat) * 100) / 100;
        this.setEditorMode(this.mode);
    }
    
    getChartPoint() {
        return Object.keys(this.chartPoint).length === 0 ? null : this.chartPoint;
    }

    getCanvas() {
        return this.ctx.canvas;
    }

    setEditorMode(mode) {
        this.mode = mode;

        switch (mode) {
            case 'obstacle':
                this.ctx.strokeStyle = 'red';
                this.ctx.fillStyle = 'red';
                break;
                
            case 'absorber':
                this.ctx.strokeStyle = 'green';
                this.ctx.fillStyle = 'green';
                break;

            case 'source':
                this.ctx.strokeStyle = 'blue';
                this.ctx.fillStyle = 'blue';
                break;
                
            default:
                this.ctx.strokeStyle = 'black';
                this.ctx.fillStyle = 'black';
                break;
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    resize(w, h) {
        this.ctx.canvas.width = parseInt(w);
        this.ctx.canvas.height = parseInt(h);
        this.clear();
    }

    getWidth() {
        return this.ctx.canvas.width;
    }

    getHeight() {
        return this.ctx.canvas.height;
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.data = data;
    }

    updateData() {
        let tmp = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height),
            row = 0, col = 0, val = 0;

        for (let i = 0; i < tmp.data.length; i++) {
            if ((i+1)%4 == 0) { 
                if (col >= tmp.width) {
                    col = 0;
                    row++;
                }
                
                val = 0;

                if (tmp.data[i] > 0) {
                    val = tmp.data[i] / 255;

                    if (tmp.data[i-3] + tmp.data[i-2] + tmp.data[i-1]) {
                        val = tmp.data[i-3] > 0 ? 2 : val;
                        val = tmp.data[i-2] > 0 ? -1 : val;
                        val = tmp.data[i-1] > 0 ? 3 : val;
                    } else {
                        val = val == 1 ? this.concentrat : this.data[row][col];
                    }
                }

                this.data[row][col] = val;
                col++;
            }
        }
        this.draw(this.data2uint8ca(this.data));
        tmp = null;
    }

    data2uint8ca(data) {
        let uint8ca = [];

        for (let row = 0; row < this.ctx.canvas.height; row++) {
            for (let col = 0; col < this.ctx.canvas.width; col++) {
                if (data[row][col] == 3) {
                    uint8ca.push(0);
                    uint8ca.push(0);
                    uint8ca.push(255);
                    uint8ca.push(255);
                } else if (data[row][col] == 2) {
                    uint8ca.push(255);
                    uint8ca.push(0);
                    uint8ca.push(0);
                    uint8ca.push(255);
                } else if (data[row][col] == -1) {
                    uint8ca.push(0);
                    uint8ca.push(128);
                    uint8ca.push(0);
                    uint8ca.push(255);
                } else {
                    for (let n = 0; n < 3; n++) uint8ca.push(0);
                    uint8ca.push(data[row][col]*255);
                }
            }
        }
        data = null;

        return uint8ca;
    }

    draw(uint8ca) {
        this.ctx.putImageData(
            new ImageData(new Uint8ClampedArray(uint8ca), this.ctx.canvas.width, this.ctx.canvas.height), 0, 0
        );

        uint8ca = null;
    }

    updateStatusBar(mouseVal) {
        switch (mouseVal) {
            case 3:
                this.statusbar.textContent = `x=${this.currPos.X}, y=${this.currPos.Y}, Постоянный источник(D=1)`;
                break;
            case 2:
                this.statusbar.textContent = `x=${this.currPos.X}, y=${this.currPos.Y}, Препятствие`;
                break;
            case -1:
                this.statusbar.textContent = `x=${this.currPos.X}, y=${this.currPos.Y}, Поглотитель(D=0)`;
                break;
        
            default:
                this.statusbar.textContent = `x=${this.currPos.X}, y=${this.currPos.Y}, D=${mouseVal.toFixed(6)}`;
                break;
        }
    }

    _init() {
        this.clear();
        this.generateStartData();
    }

    generateStartData() {
        this.data = [];
        for(let i = 0; i <= this.ctx.canvas.height+1; i++) {
            this.data[i] = [];
            for(let j = 0; j <= this.ctx.canvas.width+1; j++) {
                this.data[i][j] = 0;
            }
        }
    }

    _setMouseHandlers() {
        this.ctx.canvas.addEventListener('mousemove', (e) => {
            let rect = canvas.getBoundingClientRect();

            this.currPos.X = ~~(e.clientX - rect.left);
            this.currPos.Y = ~~(e.clientY - rect.top);

            this.updateStatusBar(this.data[this.currPos.Y][this.currPos.X]);
        });
        
        this.ctx.canvas.addEventListener('mousemove', (e) => {
            if (!this.shiftDown && this.isMouseDown) this.mouseDrawing();
                
            this.prevPos.X = this.currPos.X;
            this.prevPos.Y = this.currPos.Y;
        });

        this.ctx.canvas.addEventListener('mouseleave', (e) => { 
            this.isMouseDown = false;
            this.updateData();
        });

        this.ctx.canvas.addEventListener('mouseup', (e) => { 
            this.isMouseDown = false; 
            this.updateData();
        });

        this.ctx.canvas.addEventListener('mousedown', (e) => { 
            this.startPos.X = this.prevPos.X = this.currPos.X;
            this.startPos.Y = this.prevPos.Y = this.currPos.Y;

            this.ctx.beginPath();
            this.isMouseDown = true;

            if (this.shiftDown) {
                this.chartPoint.X = this.currPos.X;
                this.chartPoint.Y = this.currPos.Y;
                document.querySelector('#chart_point').innerHTML = '<b>Выбрана точка (' + this.chartPoint.X + ', ' + this.chartPoint.Y + ')</b>';
                
            }
        });

        document.addEventListener('keydown', (e) => {
            switch (e.keyCode) {
                case 17: this.ctrlDown = true; break;
                case 16: this.shiftDown = true; break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
                case 17: this.ctrlDown = false; break;
                case 16: this.shiftDown = false; break;
            }
        });
    }

    mouseDrawing() {
        if (this.tool != 'eraser' && this.tool != 'pen') {
            this.draw(this.data2uint8ca(this.data));
        } 

        if (this.tool != 'eraser') {
            this.ctx.globalCompositeOperation = 'source-over';
        }

        switch (this.tool) {
            case 'pen':
                this.ctx.moveTo(this.prevPos.X, this.prevPos.Y);
                this.ctx.lineTo(this.currPos.X, this.currPos.Y);
                this.ctx.stroke();
                break;
            
            case 'line':
                this.ctx.beginPath();
                this.ctx.moveTo(this.startPos.X, this.startPos.Y);
                this.ctx.lineTo(this.currPos.X, this.currPos.Y);
                break;

            case 'triangle':
                this.ctx.beginPath();
                this.ctx.moveTo(this.startPos.X + (this.currPos.X - this.startPos.X) / 2, this.startPos.Y);
                this.ctx.lineTo(this.startPos.X, this.currPos.Y);
                this.ctx.lineTo(this.currPos.X, this.currPos.Y);
                
                break;

            case 'rect':
                if (this.ctrlDown) {
                    let width = Math.abs(this.currPos.X - this.startPos.X) * (this.currPos.X < this.startPos.X ? -1 : 1);
                    let height = Math.abs(width) * (this.currPos.Y < this.startPos.Y ? -1 : 1);

                    if (this.filling) {
                        this.ctx.fillRect(this.startPos.X, this.startPos.Y, width, height);
                    } else {
                        this.ctx.strokeRect(this.startPos.X, this.startPos.Y, width, height);
                    }
                } else {
                    if (this.filling) {
                        this.ctx.fillRect(this.startPos.X, this.startPos.Y, this.currPos.X - this.startPos.X, this.currPos.Y - this.startPos.Y);
                    } else {
                        this.ctx.strokeRect(this.startPos.X, this.startPos.Y, this.currPos.X - this.startPos.X, this.currPos.Y - this.startPos.Y);
                    }
                }
                break;

            case 'circle':
                this.ctx.beginPath();
                if (this.ctrlDown) {
                    this.ctx.arc(this.startPos.X, this.startPos.Y, this._getDistance(), 0, 2 * Math.PI);
                } else {
                    this._drawEllipse(this.ctx, this.startPos.X, this.startPos.Y, this.currPos.X - this.startPos.X, this.currPos.Y - this.startPos.Y);
                }
                this.ctx.closePath();
                break;

            case 'eraser':
                this.ctx.globalCompositeOperation = 'destination-out';
                this.ctx.beginPath();
                this.ctx.arc(this.prevPos.X, this.prevPos.Y, this.line_width/2, 0, Math.PI * 2);
                this.ctx.closePath();
                // this.ctx.globalCompositeOperation = 'source-over';
                break;
        }

        this.ctx.closePath();

        if (this.filling && ['triangle', 'circle'].includes(this.tool)) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }

    }

    _drawEllipse(ctx, x, y, w, h) {
        let kappa = .5522848,
            ox = (w / 2) * kappa, 
            oy = (h / 2) * kappa,
            xe = x + w,           
            ye = y + h,        
            xm = x + w / 2,    
            ym = y + h / 2;  
    
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    }

    _getDistance() {
        return  Math.sqrt((this.currPos.X - this.startPos.X)**2 + (this.currPos.Y - this.startPos.Y)**2);
    }
}