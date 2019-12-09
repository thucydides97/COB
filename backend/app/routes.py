from app import app, db
from app.models import *
from app.utilities import *
from app.data import OrderBookStore

from datetime import datetime
from flask import request, jsonify
import pandas as pd
import numpy as np


# START UP PROCESSES
OBS = OrderBookStore()
OBS.start()
# =================


@app.route('/')
def index():
    return OBS.data


@app.route('/order_book')
def order():
    exchange = request.args.get('ex')
    sym = request.args.get('s')

    if exchange == 'GLOBAL':
        if not OBS.data:
            return {}

        result = []
        for ex in OBS.data:
            for sym in OBS.data[ex]:
                for a, b in zip(OBS.data[ex][sym]['asks'], OBS.data[ex][sym]['bids']):
                    result.append({
                        ex: a[1],
                        # 'symbol': sym,
                        'side': 'asks',
                        'price': a[0],
                        # 'size': a[1]
                    })
                    result.append({
                        ex: b[1],
                        # 'symbol': sym,
                        'side': 'bids',
                        'price': b[0],
                        # 'size': b[1]
                    })

        df = pd.DataFrame(data=result)
        df.fillna(0, inplace=True)
        df['price'] = df['price'].apply(lambda x: round(x, 1))
        df = df[df['price'].between(
            df['price'].mean() - (0.1 * df['price'].mean()), df['price'].mean() + (0.1 * df['price'].mean())
        )]
        df.set_index("price", inplace=True)
        df.sort_index(ascending=True, inplace=True)
        asks = df[df['side'] == 'asks'].drop('side', axis=1).cumsum()
        asks.sort_index(ascending=True, inplace=True)
        df.sort_index(ascending=False, inplace=True)
        bids = df[df['side'] == 'bids'].drop('side', axis=1).cumsum()
        bids.sort_index(ascending=True, inplace=True)

        result = []
        for i, row in bids.iterrows():
            r = dict(row)
            r['price'] = i
            result.append(r)
        for i, row in asks.iterrows():
            r = dict(row)
            r['price'] = i
            result.append(r)

        return jsonify({'data': result})


    try:
        data = OBS.data[exchange]
        if "BTC/USD" in data:
            return jsonify(data["BTC/USD"])
        else:
            return jsonify(data["BTC/USDT"])
    except:
        return {}


