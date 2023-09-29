import requests
from bs4 import BeautifulSoup as bs
import random

def get_soup(url):
    user_agents_list = [
        'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.83 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
    ]
    
    r = requests.get(url, headers={'User-Agent': random.choice(user_agents_list)}, allow_redirects=False)
    
    soup = bs(r.text, "html.parser")
    return soup

def get_inn(url):
    inn = get_soup(url).find_all('div', class_='supplierINN_1h_2o')[0].text.split()[-1]
    return inn