import aiohttp
import asyncio
import time
from bs4 import BeautifulSoup as bs
import json

from parser_requests import requests_info, header_gen, jsons
from filters import filters_dict

import numpy as np

start_time = time.time()

all_inns = np.load('data/uniqueinn.npy', allow_pickle=True)

data = []
type_ = 'basic'

async def aget_info(session, inn, type_):
    url, ref = requests_info[type_]['url'], requests_info[type_]['ref']  
    async with session.post(url, headers=header_gen(ref, inn), json=jsons[type_](inn)) as resp:
        json_data = await resp.json(content_type=None)
        if json_data is None:
            return {'a': None}
        
        return filters_dict[type_](json_data)
        


async def main(inns):

    async with aiohttp.ClientSession() as session:

        tasks = []
        for inn in inns:
            tasks.append(asyncio.ensure_future(aget_info(session, inn, type_)))

        lines = await asyncio.gather(*tasks)
        for line in lines:
            data.append(lines)


for i in range(0, len(all_inns), 20):
    print(i)
    start_time = time.time()
    
    if i == 1220:
        inns_slise = all_inns[1220:]
    else:
        inns_slise = all_inns[i:i+20]
         
    asyncio.run(main(inns_slise))    
    print("--- %s seconds ---" % (time.time() - start_time))
    
print('done!')

with open("data/basic_data.json", "w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False)
