import ccxt
from ccxt.base.errors import ExchangeError, ExchangeNotAvailable

from pprint import pprint
import time


exchanges = dict()

for ex in ccxt.exchanges:
    # print(ex)
    # print('-'*40)
    exchange = getattr(ccxt, ex)
    exchanges[ex] = exchange()
    try:
        exchanges[ex].load_markets()
    except ExchangeError:
        continue
    except ExchangeNotAvailable:
        continue

    if 'BTC/USD' in exchanges[ex].markets:
        print(ex, 'BTC/USD')
        continue
    elif 'BTC/USDT' in exchanges[ex].markets:
        print(ex, 'BTC/USDT')
        continue

    for market in exchanges[ex].markets:
        print(ex, market)
        break
    time.sleep(0.5)

    # print('-'*40)
    # print('-'*40)


