from app import app, db
from app.models import *
from app.utilities import *

from datetime import datetime
from flask import request, jsonify
import pandas as pd
import numpy as np



@app.route('/')
def index():
    return "Hello world"

