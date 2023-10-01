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
    df = pd.read_csv('berezka_data.csv', index_col=0)
    output = pd.DataFrame()
    for inn in tqdm.tqdm(pd.unique(df.supplierInn)):
        result = parse_inn(inn)
        while not result:
            result = parse_inn(inn)
        df_dictionary = pd.DataFrame([result])
        output = pd.concat([output, df_dictionary], ignore_index=True)

    print(output)
    output.to_csv('table_berezki_contacts.csv', index=False, encoding='utf-8')


if __name__ == "__main__":
    main()
