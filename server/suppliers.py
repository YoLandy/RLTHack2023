import pandas as pd
import numpy as np
from flask import jsonify
import json


df = pd.read_json('suppliers.json')
df['additionalokveds'] = df['additionalokveds'].apply(lambda x: np.array(x))

print(df.columns)


def get_supplier_info(ogrn):
    try:
        supplier = df[df['ogrn'] == int(ogrn)].iloc()[0]

        return {
            'name': supplier['company_name'],
            'ogrn': f"{supplier['ogrn']}",
            'regDate': f"{supplier['reg_date']}",
            'mainOkved': f"{supplier['main_okved']}",
            #'additionalOkveds': supplier['additionalokveds'],
            'authorizedCapital': f"{supplier['authorized_capital']}",
            'workers': f"{supplier['workers']}",
            'address': f"{supplier['address']}",
            'claimant': f"{supplier['claimant']}",
            'defendant': f"{supplier['defendant']}",
            'activeDebts': f"{supplier['active_debts']}",
            'completedDebts': f"{supplier['completed_debts']}",
            'status': f"{supplier['status']}",
            'RNP': f"{supplier['RNP']}",
            #'facts': supplier['facts'],
        }
    except IndexError:
        return {}


if __name__ == '__main__':
    print(get_supplier_info(1027402933040))

