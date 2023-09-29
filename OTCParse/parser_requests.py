import requests

def json1(inn): 
    return {
        'inn': f'{inn}',
        'kpp': None,
        'externalId': None,
        'marketPlaceId': None,
        'isCustomer': False,
    } 

def json2(inn):
    return {
        'participantInn': f'{inn}',
        'participantKpp': None,
    }
    
jsons = {
    'basic' :   json1,
    'balance':  json1,
    'pnl':      json1,
    'contract': json1,    
    'tender':   json1,
    'participant':  json2
}
    

def header_gen(refer_url, inn):
    return {
        'authority': 'otc.ru',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json;charset=UTF-8',
        # 'cookie': '.ASPXANONYMOUS=v_RTiFcvoV90GScKqJ9EbpGVaS1mVQYsxQnmwvzUhKDjcAOKAq2EQyLrCIjeFEoX5NVPgKe152PooHTEJsgEqaE05CWTzj1gxH9hReq55-3FstYDf61uWHaPdmWFmUwx0e0yVw2; _ym_uid=1695911039108399510; _ym_d=1695911039; _ym_isad=1; _gid=GA1.2.1511987277.1695911040; __exponea_etc__=1486ca44-629e-474a-a4a7-1a3680b56359; _gcl_au=1.1.1067473106.1695911050; AnonymousId=3912f46e-55ae-4132-9903-0d330841c4e1; .Otc-Production-Place=All; __exponea_time2__=2.2559144496917725; AnonymousB2B_Id=d52e64ca-e07b-44f9-b95d-81c8be5e1f64; __hash_=5daa884b5787e7b6a76f4a95ecb4b399; __lhash_=14cb5c2276e09a1418f052e39dc36085; _ym_visorc=w; _gat_UA-85541075-2=1; _dc_gtm_UA-85541075-1=1; _gat_gtag_UA_85541075_1=1; _ga=GA1.2.574128752.1695911040; _ga_JETZFKP0Y8=GS1.1.1695945069.3.0.1695945099.30.0.0',
        'origin': 'https://otc.ru',
        'referer': f'{refer_url}?inn={inn}',
        'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
    }

requests_info = {
    'basic' :       {'ref': "https://otc.ru/counterparty",                  'url': 'https://otc.ru/microservices-otc/counteragent/api/counteragent/get'},
    'balance':      {'ref': "https://otc.ru/counterparty/finance",          'url': 'https://otc.ru/microservices-otc/counteragent/api/counteragent/get-balance-sheet'},
    'pnl':          {'ref': "https://otc.ru/counterparty/finance",          'url': 'https://otc.ru/microservices-otc/counteragent/api/counteragent/get-pnl-statement'},
    'contract':     {'ref': "https://otc.ru/counterparty/salesandsupplies", 'url': 'https://otc.ru/microservices-otc/counteragent/api/counteragent/get-contracts-exec-exp'},
    'tender':       {'ref': "https://otc.ru/counterparty/salesandsupplies", 'url': 'https://otc.ru/microservices-otc/counteragent/api/counteragent/get-tenders-participation-exp'},
    'participant':  {'ref': "https://otc.ru/counterparty/salesandsupplies", 'url': 'https://otc.ru/microservices-otc/order-analytics/api/data/participant-contracts'}
}

def make_request(type_, inn):
    url, ref = requests_info[type_]['url'], requests_info[type_]['ref']  
    return requests.post(url, headers=header_gen(ref, inn), json=jsons[type_](inn))

'''
for type_, info in requests_info.items():
    url, ref = info['url'], info['ref']
    requests_dict[type_] = lambda inn: requests.post(url, headers=header_gen(ref, inn), json=json_data(inn))
'''

