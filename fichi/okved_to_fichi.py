import requests
from bs4 import BeautifulSoup
import pandas as pd
import tqdm


def ogrn_to_fichi(ogrn):
    page = requests.get(
        f'https://synapsenet.ru/organizacii/{ogrn}')
    soup = BeautifulSoup(page.text, "html.parser")

    try:
        reliability = soup.findAll('div', class_='oct-flag')[-1].findAll('div')[-1].text  # Надёжность
    except IndexError:
        reliability = None
    reg_date = soup.findAll('div', class_='oc-op-reg-date')[0].text.split()[-1]  # Дата регистрации
    okved_boxes = soup.findAll('div', class_='oc-okved-line')
    main_okved = okved_boxes[0].findAll('span')[0].text  # Основной вид деятельности ОКВЭД
    additionalokveds = []  # Дополнительные виды деятельности ОКВЭД
    for okved_box in okved_boxes[1:]:
        additionalokveds.append(okved_box.findAll('span')[0].text)

    try:
        authorized_capital_raw = soup.find('div', 'ocb-capital-line').findAll('div')[-1].text
        authorized_capital = "".join(c for c in authorized_capital_raw if c.isdigit())  # Уставной капитал
    except AttributeError:
        authorized_capital = None
    workers_raw = soup.find('div', class_='org-smp-block').findAll('span')[-1].text
    workers = "".join(c for c in workers_raw if c.isdigit())  # Количество работников
    address = soup.find('div', class_='oc-full-adress').find('div', class_='copy-script').text  # Адрес

    """ ________________ Судебные дела _____________ """
    claimant = soup.findAll('div', class_='co-statistics-block')[0].findAll('div')[-1].text  # Истец в делах
    defendant = soup.findAll('div', class_='co-statistics-block')[1].findAll('div')[-1].text  # Ответчик в делах
    active_debts = soup.findAll('div', class_='co-statistics-block')[2].findAll('div')[-1].text  # Активные долги
    completed_debts = soup.findAll('div', class_='co-statistics-block')[3].findAll('div')[-1].text  # Завершённые долги

    status_text = soup.find('div', class_='oc-operating-status').findAll('div')[1].text
    RNP_text = soup.find('div', class_='oc-tender-registry').findAll('div')[1].text
    if RNP_text.find('не числилось') != -1:
        RNP = 0
    elif RNP_text.find('досрочно исключено') != -1:
        RNP = 1
    elif RNP_text.find('числится в РНП до') != -1:
        RNP = 3
    else:
        RNP = 2

    facts_text = soup.findAll('div', class_='oc-assessment-fact')
    try:
        facts = {
            'good': facts_text[2].div.text,
            'normal': facts_text[1].div.text,
            'bad': facts_text[0].div.text,
        }
    except IndexError:
        facts = None

    if status_text.find('ликвидирован') != -1:
        status = False
    else:
        status = True  # Действует ли организация

    result = {
        'ogrn': ogrn,
        'reliability': reliability,
        'reg_date': reg_date,
        'main_okved': main_okved,
        'additionalokveds': additionalokveds,
        'authorized_capital': authorized_capital,
        'workers': workers,
        'address': address,
        'claimant': claimant,
        'defendant': defendant,
        'active_debts': active_debts,
        'completed_debts': completed_debts,
        'status': status,
        'RNP': RNP,
        'facts': facts,
    }

    return result


def parse_ogrn(ogrn):
    try:
        ogrn = int(ogrn)
        return ogrn_to_fichi(ogrn)
    except requests.exceptions.ConnectionError as ex:
        pass
    except Exception as ex:
        print(ex)
        return {'ogrn': ogrn}


def main():
    df = pd.read_json('notnan_products.json')
    output = pd.DataFrame()
    for ogrn in tqdm.tqdm(pd.unique(df.supplierOgrn)):
        result = parse_ogrn(ogrn)
        while not result:
            result = parse_ogrn(ogrn)
        df_dictionary = pd.DataFrame([result])
        output = pd.concat([output, df_dictionary], ignore_index=True)

    print(output)
    output.to_json('table_berezki_2.json')


if __name__ == "__main__":
    main()
