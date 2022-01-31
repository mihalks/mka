import xlsxwriter
import os 
import uuid
from app import app
from flask import render_template, request, redirect, url_for, make_response, send_file


@app.route('/index')
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create_xlsx_file', methods=['GET', 'POST'])
def create_xlsx_file():
    if request.method == 'POST':

        data = request.get_json()

        filename = '%s.xlsx' % str(uuid.uuid4())

        workbook = xlsxwriter.Workbook(filename=os.path.join(app.config['TEMP_FOLDER'], filename))
        wodksheet = workbook.add_worksheet('Sheet1')
        chart = workbook.add_chart({'type': 'line'})

        wodksheet.set_column(0, 1, 25)

        wodksheet.merge_range(0, 0, 0, 4, 'Данные для точки (%s, %s)' % (data['X'], data['Y']))
        wodksheet.write(1, 0, 'Момент времени, с')
        wodksheet.write(1, 1, 'Концентрация')

        row = 2
        for i, dt in enumerate(data['time']):
            wodksheet.write(row, 0, dt)
            wodksheet.write(row, 1, data['data'][i])
            row += 1

        chart.add_series({
            'categories': '=Sheet1!$A$3:$A$%s' % (len(data['data']) + 2),
            'values': '=Sheet1!$B$3:$B$%s' % (len(data['data']) + 2),
            'name': '=Sheet1!$B$2:$B$2',

        })

        chart.set_size({'width': 720, 'height': 480})
        chart.set_title({'name': 'Изменение концентрации в точке с течением времени'})
        wodksheet.insert_chart('D3', chart)

        workbook.close()

        return make_response({
            'filename': filename
        })


    return redirect(url_for('index'))

    
@app.route('/download/<filename>')
def downloadFile (filename):
    path = '%s/%s' % (app.config['TEMP_FOLDER'], filename)
    if os.path.isfile(path):
        return send_file(path, as_attachment=True)
    else:
        return redirect(url_for('index'))
