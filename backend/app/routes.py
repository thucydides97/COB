from app import app, db
from app.models import *
from app.utilities import *

from datetime import datetime
from flask import request, jsonify
import pandas as pd
import numpy as np


@app.route('/')
@app.route('/index')
def index():
    df = pd.read_csv('../socai/CSVs/UChrjz9yiHO-GlQ2QFSsNx2w_processed.csv')
    return jsonify(
        {'data': df.to_dict(orient='records')}
    )


@app.route('/scatter')
def get_scatter():
    df = pd.read_csv('../socai/CSVs/UChrjz9yiHO-GlQ2QFSsNx2w_processed.csv').dropna(subset=['like_count', 'dislike_count'])
    data = [[x, y] for x, y in zip(df['like_count'].values, df['dislike_count'].values)]
    chart = {
        'chart': {
            'type': 'scatter',
            'zoomType': 'xy'
        },
        'xAxis': {
            'title': {
                'enabled': True,
                'text': 'Likes'
            },
            'startOnTick': 'true',
            'endOnTick': 'true',
            'showLastLabel': 'true'
        },
        'yAxis': {
            'title': {
                'text': 'Dislikes'
            }
        },
        'plotOptions': {
            'scatter': {
                'marker': {
                    'radius': 5,
                    'states': {
                        'hover': {
                            'enabled': 'true',
                            'lineColor': 'rgb(100,100,100)'
                        }
                    }
                },
                'states': {
                    'hover': {
                        'marker': {
                            'enabled': 'false'
                        }
                    }
                },
            }
        }
    }
    chart['series'] = [{"name": "first", "data": data}]

    return jsonify({'options': chart})
