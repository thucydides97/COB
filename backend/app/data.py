import ccxt
from ccxt.base.errors import BadSymbol, ExchangeError, ExchangeNotAvailable

from pprint import pprint
import time
import threading


class Data(threading.Thread):
    def __init__(self, delay=1):
        threading.Thread.__init__(self)

        self.exchanges = dict()
        self.data = dict()
        self.delay = delay
        self.runnable = self.pull_loop
        self.daemon = True

    def run(self):
        self.runnable()

    def pull_data(self):
        # TODO: cxt.exchanges:
        for ex in ['binance', 'bitfinex', 'bitstamp', 'bittrex', 'kraken', 'kucoin', 'poloniex']:
            time.sleep(self.delay)

            exchange = getattr(ccxt, ex)
            self.exchanges[ex] = exchange()
            try:
                self.exchanges[ex].load_markets()
            except ExchangeError:
                continue
            except ExchangeNotAvailable:
                continue
            except Exception as e:
                print(e)
                continue

            m = ['BTC/USD']
            if 'BTC/USD' not in self.exchanges[ex].markets:
                if 'BTC/USDT' in self.exchanges[ex].markets:
                    m = ['BTC/USDT']
                else:
                    pprint(self.exchanges[ex].markets)

            for market in m:  # TODO: self.exchanges[ex].markets:
                try:
                    ob = self.exchanges[ex].fetch_order_book(market)
                except BadSymbol:
                    print(ex, 'bad symbol')
                    continue

                self.data[ex] = {
                    market: ob
                }

    def pull_loop(self):
        while self.is_alive():
            print('...')
            self.pull_data()


if __name__ == '__main__':
    d = Data()
    d.start()

    for x in range(100):
        print(x)
        time.sleep(1)
