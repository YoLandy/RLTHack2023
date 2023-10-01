from searcher_demo_new import r
from suppliers import get_supplier_info
import pandas as pd
import numpy as np
import requests
from datetime import datetime


df = pd.read_json('products.json')
df["sys_embbedings"] = df["sys_embbedings"].apply(lambda x: np.array(x))


class Handler:
    async def search_handler(self, request):
        start = datetime.now()
        if request['params']['searchBy'] == 'PRODUCTS':
            pages_count, ranking = r.get_ranking_data(
                request['params']['phrases'], page=request['params']['pageNumber'] - 1,
                elemnts_per_page=request['params']['limit'], searc_by="product"
            )
            found = [
                {
                    'seller': get_supplier_info(item['ogrn']),
                    'products': [{
                        'fullPrice': item['price'],
                        'searchPhrase': item['name'],
                        'category': item['okpd-2'],
                        'shippingRegion': item['shipping_region'],
                        'description': item['description'],
                        'reliability': item['reliability'],
                    }]
                } for index, item in ranking.iterrows()
            ]
        else:
            pages_count, ranking = r.get_ranking_data(
                request['params']['phrases'], page=request['params']['pageNumber'] - 1,
                elemnts_per_page=request['params']['limit'], searc_by="customer"
            )
            found = [
                {
                    'seller': get_supplier_info(item['ogrn'])
                } for index, item in ranking.iterrows()
            ]

        result = {
            'type': 'SEARCH',
            'payload': {
                'searchBy': request['params']['searchBy'],
                'searchList': request['params']['phrases'],
                'category': {
                    'id': '0',
                    'name': 'name',
                    'tree': ['tree'],
                },
                'found': found,
                'filters': request['params']['filters'],
                'pagesCount': pages_count,
            }
        }

        return result

    async def seller_request_handler(self, request):
        ogrn = request['params']['ogrn']
        result = get_supplier_info(ogrn)

        return result

    async def result_handler(self, request):
        if request['type'] == 'SEARCH':
            return await self.search_handler(request)
        if request['type'] == 'SELLER':
            return await self.seller_request_handler(request)


handler = Handler()
if __name__ == '__main__':
    response = "ноутбук"

    import asyncio
    loop = asyncio.get_event_loop()
    loop.run_until_complete(handler.result_handler({'type': 'SEARCH', 'params': {'phrases': ['стул красный жёлтый'], 'filters': {}, 'searchBy': 'PRODUCTS', 'limit': 25, 'pageNumber': 1, 'onlyHasAllSearch': True}}))
    loop.close()

    #print(ranking_by_metric(df, response, calc_metric_nlp, 10))
