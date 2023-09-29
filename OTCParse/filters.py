def basic_filter(json_data):
    simple_keys = ['inn', 'kpp', 'ogrn', 'statusText', 'okpo', 'fullName', 'shortName']
    
    comlicated_keys = {
        'fnsData': ['supNr'],
    }
    
    list_keys = {
        'okveds': ['code', 'name'],
        'counteragentAddresses': ['oktmo', 'okato', 'fullAddress', 'country', 'regionRF', 'city', 'street', 'home', 'office', 'postIndex', 'kladrCodeRegionCode'],
    }
    
    data = {}
    
    for key in simple_keys:
        data[key] = json_data[key]
    
    for key, values in comlicated_keys.items():
        for value in values:
            column_name = f'{key} {value}'
            data[column_name] = json_data[key][value]
    
    for key, values in list_keys.items():
        for value in values:
            column_name = f'{key} {value}'
            data[column_name] = [line[value] for line in json_data[key]]

    return data

def process_data_values_list(data):
    years = [value['year'] for value in data]
    values = [value['value'] for value in data]
    return years, values

def finance_filter(json_data):
    data = {} 
    
    data['inn'] = json_data['inn']
    
    for key in json_data:
        if key in ['inn', 'years']:
            continue
        
        for line in json_data[key]:
            name, code = line['name'], line['code']
            years, values = process_data_values_list(line['valuesList'])
            data[f'{code} {name}'] = {year : value for year, value in zip(years, values)} 
    
    return data

filters_dict = {
    'basic' :       basic_filter,
    'balance':      finance_filter,
    'pnl':          finance_filter,
    'contract':     lambda x: x,
    'tender':       lambda x: x,
    'participant':  lambda x: x
}
