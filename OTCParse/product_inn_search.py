import requests
import bs4
import json

from inn_parse import get_inn, get_soup

#окведы
okveds = 'ok=26.20.1&ok=28.23&ok=28.24&ok=28.25&ok=28.1&ok=22.21&ok=22.22&ok=22.23&ok=26.51.4&ok=26.51.5&ok=26.51.8&ok=25.94&ok=27.12'.split("&")

#ссылка для поиска по окведу
url_generator = lambda okved: f'https://otc.ru/marketplace-b2b/?{okved}&pz=false'

#наша бд
all_data = []


def process_page(url):
    '''
    Для каждой страницы поиска
    '''
    items = get_soup(url).find_all('a', class_='name_2D3SN')

    for i, item in enumerate(items):
        item_link = item['href']
        item_name = item.text
        inn = get_inn(item_link)
    
        all_data.append({
            'link': item_link,
            'name': item_name,
            'inn': inn
        })
        
def process_okved(okved):
    '''
    Для каждого окведа
    '''
    url = url_generator(okved)
    for p in range(2, 51):
        p_url = url + f'&p={p}'
        print(p_url)
        process_page(p_url)
        
for okved in okveds:
    process_okved(okved)

#!!!! не перезапишите данные, довольно долго делается !!!!
with open("data/inn-product.json", "w", encoding='utf-8') as outfile:
    json.dump(all_data, outfile, ensure_ascii=False)