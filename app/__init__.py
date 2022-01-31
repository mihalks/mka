import os
from flask import Flask
app = Flask(__name__)

app.config['TEMP_FOLDER'] = os.path.dirname(os.path.abspath(__file__)) + '/temp'

from . import views