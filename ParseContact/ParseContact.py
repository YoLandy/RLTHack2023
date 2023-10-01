import requests
from bs4 import BeautifulSoup
import pandas as pd
import tqdm


def inn_to_address(inn):
    page = requests.get(f'https://sbis.ru/contragents/{inn}')
    soup = BeautifulSoup(page.text, "html.parser")
    try:
        telephone = soup.find('div', class_='cCard__Contacts-String').find('div', itemprop="telephone").text
    except AttributeError:
        telephone = None

    try:
        mail = soup.find('div', class_='cCard__Contacts-String').find('a', itemprop="email").text
    except AttributeError:
        mail = None

    #print(telephone, mail)

    result = {
        'supplierInn': inn,
        'mail': mail,
        'phone': telephone
    }

    return result


def parse_inn(inn):
    try:
        inn = int(inn)
        return inn_to_address(inn)
    except requests.exceptions.ConnectionError as ex:
        pass
    except Exception as ex:
        print(ex)
        return {'supplierInn': inn}


def main():
    df = pd.read_json('berezka_products.json')
    output = pd.DataFrame()
    for idx, inn in tqdm.tqdm(enumerate(pd.unique(df.supplierInn))):
        result = parse_inn(inn)
        while not result:
            result = parse_inn(inn)
        df_dictionary = pd.DataFrame([result])
        output = pd.concat([output, df_dictionary], ignore_index=True)
        if idx%50 == 0:
            output.to_csv('table_berezki_contacts.csv', index=False, encoding='utf-8')

    print(output)
    output.to_csv('table_berezki_contacts.csv', index=False, encoding='utf-8')


if __name__ == "__main__":
    main()
