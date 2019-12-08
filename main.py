import ccxt
from pprint import pprint

poloniex = ccxt.poloniex()
poloniex.load_markets()

exchanges = dict()

for ex in ccxt.exchanges:
    exchange = getattr(ccxt, ex)
    exchanges[ex] = exchange()
    exchanges[ex].load_markets()


for name, ex in exchanges.items():

