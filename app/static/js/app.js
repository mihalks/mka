class App {
    constructor(formEl, canvasEl, editorBlock) {
        this.canvas = new CanvasHandler(canvasEl);
        this.model = new Model();
        this.editor = editorBlock;
        this.form = formEl;
       
        this.timeinfobar = canvasEl.parentElement.querySelector('#timeinfo');
 
        this.steps = 100;
        this.tick = 0;
        this.raf = 0;
        this.dt = 0.1;
 
        this._starPoint = null;
        this._storage = null;
        this._sv = 50;
        this.chart = null;
 
        this._isStoped = false;
 
        this.readDataFromForm();
        this.readDataFromEditor();
        this._setEventHandlers();
        this.updateInfobar();
    }
 
    start() {
        this._setModel();
        if (!this._isStoped) {
            if (this._validateForm()) {
 
                this.tick = 0;
 
                this._starPoint = this.canvas.getChartPoint();
 
                if (this._starPoint) {
                    this._storage = {};
                    this._sv = Math.round(this.steps / 50);
 
                    if (this.chart) {
                        document.querySelector('#response').style.display = 'none';
                        this.chart.destroy();
                    }
                }
 
                this._tick();
            } else {
                alert('Неверные данные');
            }
        } else {
            this._tick();
        }
    }
 
    stop() {
        cancelAnimationFrame(this.raf);
        this._isStoped = true;
    }
 
    reset() {
        cancelAnimationFrame(this.raf);
        this.tick = 0;
        this.canvas.clear();
        this.canvas.generateStartData();
        this.updateInfobar();
    }
 
    load_file() {
        let loaderForm = document.createElement('form');
        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                let file = e.target.files[0];
               
                if (file.type == 'application/json') {
                    let reader = new FileReader();
                    reader.readAsText(file);
 
                    reader.onload = (e) => {
                        let data_from_file = JSON.parse(e.target.result);
 
                        this.reset();
                       
                        for (let el_name in data_from_file.form) {
                            this.form[el_name]. value = data_from_file.form[el_name];
                            if (el_name == 'steps') {
                                this.steps = this.form.steps.value;
                            }
                        }
                       
                        if (data_from_file.width && data_from_file.height) {
                            this.canvas.getCanvas().height = data_from_file.height;
                            this.canvas.getCanvas().width = data_from_file.width;
                            this.canvas.generateStartData();
                        }
                       
                        this.tick = data_from_file.tick;
                        this.canvas.setData(data_from_file.canvas);
 
                        if (data_from_file.state.length) {
                            this._isStoped = true;
                            this.canvas.draw(
                                this.canvas.data2uint8ca(data_from_file.state)
                            );
                        } else {
                            this.canvas.draw(
                                this.canvas.data2uint8ca(data_from_file.canvas)
                            );
                        }
 
                        this.updateInfobar();
                        alert('Данные успешно восстановлены!');
                    };
                }
            }
        });
 
        loaderForm.appendChild(fileInput);
        document.body.appendChild(loaderForm);
        fileInput.click();
 
        setTimeout(() => {
            document.body.removeChild(loaderForm);
        }, 0);
    }
   
    save2file() {
        let data = {};
 
        data.state = this.model.getData();
        data.canvas = this.canvas.getData();
        data.tick = this.tick;
        data.width = this.canvas.getCanvas().width;
        data.height = this.canvas.getCanvas().height;
 
        data.form = {};
 
        for (let el of this.form) {
            if (el.tagName == 'INPUT') {
                data.form[el.name] = el.value;
            }
        }
 
        data = JSON.stringify(data);
 
        this._download(data, 'save.json', 'application/json');
    }
 
    setChart() {        
        if (this._starPoint && this._storage) {
            let labels = Object.keys(this._storage);
            let values = Object.values(this._storage);
 
            for (let i = 0; i < values.length; i++) {
                values[i] = values[i] == 3 ? 1 : values[i];
                values[i] = values[i] == -1 ? 0 : values[i];
                values[i] = values[i] == 2 ? 0 : values[i];
            }
           
            this.chart = new Chart(document.querySelector('#chart').getContext('2d'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'D',
                        data: values,
                        backgroundColor: 'rgba(35, 77, 212, 0.6)',
                        fill: false,
                        borderColor: '#ff6384',
                        borderWidth: 1
                       
                    }]
                },
                options: {
                    responsive: true,
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: ''
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Время, c'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'D'
                            }
                        }]
                    }
                }
            });
 
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/create_xlsx_file');
            xhr.setRequestHeader('Content-Type', 'application/json');
 
            xhr.send(JSON.stringify({
                X:this._starPoint.X,
                Y: this._starPoint.Y,
                data: values,
                time: labels
            }));
 
            xhr.onload = (json) => {
                if (xhr.status != 200) {
                    alert(`Error ${xhr.status}: ${xhr.statusText}`);
                } else {
                    let response = document.querySelector('#response');
                    response.querySelector('a').href = '/download/' + JSON.parse(xhr.response).filename;
                    response.style.display = 'block';
                }
            };
 
            xhr.onerror = () => {
                alert("Request failed");
            };
 
            data = null;
            labels = null;
            stkeys = null;
            this._storage = null;
        }
    }
 
    updateInfobar() {
        this.timeinfobar.textContent = `Шаг: ${this.tick} | Время: ${this.getTime()}c`;
    }
 
    readDataFromForm() {
        this.steps = parseInt(this.form.steps.value);
 
        if (this._validateForm()) {
            this.model.set_dt(this.form.delta_T.value);
            this.model.set_D(this.form.D.value);
            this.model.set_h(this.form.h.value);
            this.model.calcA();
            this._isStoped = false;
        }
    }
 
    readDataFromEditor() {
        this.canvas.setActiveTool(this.editor.tool.value);
        this.canvas.setBrushType(this.editor.brush_type.value);
        this.canvas.setFilling(this.editor.filling.checked);
        this.canvas.setEditorMode(this.editor.mode.value);
        this.canvas.setBrushSize(this.editor.brush_size.value);
 
        this.canvas.setBrushSize(this.editor.brush_size.value);
        this.canvas.setStartConcentrat(this.editor.startConcentrat.value);
    }
 
    getTime() {
        return (this.tick*this.dt).toFixed(3);
    }
 
    _download(data, filename, type) {
        let file = new Blob([data], {type: type});
 
        if (window.navigator.msSaveOrOpenBlob) { // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        } else {
            let a = document.createElement('a'),
                url = URL.createObjectURL(file);
 
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
 
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0);
        }
 
        file = null;
    }
 
    _tick() {
        this.raf = requestAnimationFrame(() => {
            if (this.tick > this.steps) {
                cancelAnimationFrame(this.raf);
                this.setChart();
                this.tick = 0;
                return;
            }
 
           
            if (this.tick % 3 == 0 || this.tick == this.steps-1) {
                this.model.proccess(true);
                this.canvas.draw(this.model.uint8ca);
            } else {
                this.model.proccess();
            }
 
            if (this._starPoint && (this.tick % this._sv == 0 || this.tick == this.steps)) {
                this._storage[this.getTime()] = this.model.getDataByCoords(this._starPoint.X, this._starPoint.Y);
            }
           
            this.updateInfobar();
            this.tick++;
 
            this._tick();
        });
    }
 
    _setModel() {
        this.model.setHeight(this.canvas.getHeight());
        this.model.setWidth(this.canvas.getWidth());
        this.model.setData(this.canvas.getData());
    }
 
    _setEventHandlers() {
        // FForm
        this.form.addEventListener('change', (e) => {
            this.readDataFromForm();
        });
 
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
 
        // Buttons
        this.form.start.addEventListener('click', () => { this.start(); });
        this.form.stop.addEventListener('click', () => { this.stop(); });
        this.form.reset.addEventListener('click', () => { this.reset(); });
        this.form.save.addEventListener('click', () => { this.save2file(); });
        this.form.load.addEventListener('click', () => { this.load_file(); });
 
        // Editor
        this.editor.clear.addEventListener('click', () => {
            this.canvas.clear();
            this.canvas.generateStartData();
        });
        this.editor.resize.addEventListener('click', () => {
            this.canvas.resize(this.editor.width.value, this.editor.height.value);
        });
 
        this.editor.addEventListener('change', (e) => {
            if (![this.editor.width, this.editor.height].includes(e.target)) {
                this.readDataFromEditor();
            }
        });
 
        this.editor.addEventListener('click', (e) => {
            if (e.target.type == 'radio') {
                this.readDataFromEditor();
            }
        });
 
        this.editor.brush_size.addEventListener('input', (e) => {
            e.target.previousElementSibling.querySelector('span').textContent = e.target.value + 'px';
        });
 
        this.editor.startConcentrat.addEventListener('input', (e) => {
            e.target.previousElementSibling.querySelector('span').textContent = e.target.value;
        });
    }
 
    _validateForm() {
        let validCondition = (parseFloat(this.form.D.value) * parseFloat(this.form.delta_T.value)) / (parseFloat(this.form.h.value)**2);
        console.log(validCondition);
 
        return validCondition < 0.25;
    }
}