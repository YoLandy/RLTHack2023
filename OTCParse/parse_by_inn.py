import requests
import bs4
import json

from parser_requests import requests_info, make_request
from filters import filters_dict
from inn_parse import get_inn, get_soup

# тут надо вставить инн
inns = [9729288908]

#куда все запишем
data = []

#какой тип данных парсим
'''
'basic' :  базовая инфа о компании     
'balance': баланс     
'pnl':     
'contract': с кем какие контракты были     
'tender':   выйгранные тендеры
'participant' кому выполнял контракт

'''

for inn in inns:
    json_data_ = make_request('basic', inn).json()
    data.append(filters_dict['basic'](json_data_))
    
print(data)


# вот для примера все типы

types = ['basic', 'balance', 'pnl', 'contract', 'tender', 'participant']

inn = inns[0]

for type_ in types:
    json_data_ = make_request(type_, inn).json()
    print(filters_dict[type_](json_data_))