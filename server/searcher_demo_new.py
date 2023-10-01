#!/usr/bin/env python
# coding: utf-8

# In[95]:


import requests
import bs4
import json
import sys
sys.path.insert(0, '../')  # добавляем путь к папке верхнего уровня
sys.path.insert(0, '.../')


# In[96]:


import pandas as pd
import re
import numpy as np


# In[97]:


from sentence_transformers import SentenceTransformer
model = SentenceTransformer('DeepPavlov/rubert-base-cased-sentence')


# In[98]:


prod = pd.read_json('products.json')
prod["sys_embbedings"] = prod["sys_embbedings"].apply(lambda x: np.array(x))


# In[99]:


def _calc_reliability(x):
    if x == "высокая":
        return 1.0
    if x == "нет информации":
        return 0.92
    if x == "средняя":
        return 0.95
    if x == "низкая":
        return 0.85
prod['reliability_float'] = prod['reliability'].apply(_calc_reliability)
prod.head()


# In[100]:


supp = pd.read_json('suppliers.json')
supp.head()


# In[101]:


all_ogrns = set(supp["ogrn"].values) & set(prod["ogrn"].values)
all_ogrns = list(all_ogrns)
mask = prod["ogrn"].apply(lambda x: x in all_ogrns)
prod = prod[mask]
mask = supp["ogrn"].apply(lambda x: x in all_ogrns)
supp = supp[mask]


# In[102]:


from Levenshtein import distance
import numpy as np
from sentence_transformers import SentenceTransformer
import pymorphy2
morph = pymorphy2.MorphAnalyzer()

model = SentenceTransformer('DeepPavlov/rubert-base-cased-sentence')

def _calc_cosinus(a, b):
    return np.sum(a*b)/(np.sum(a*a)*np.sum(b*b))**0.5

def calc_occurrences_single(x, responses):
    lem_responses = [morph.parse(word)[0].normal_form for word in responses]
    matchings = [resp.lower() in x.lower() for resp in responses]
    return np.mean(matchings)**0.5

def calc_metric_occurrences(df, response):
    responses = response.split()
    score = df.apply(lambda x: calc_occurrences_single(x["name"], responses) , axis = 1)
    return score

def calc_metric_lev(df, response = ""):
    score = 1-df.apply(lambda x: distance(x["simple_name"].lower(), response.lower())/len(response), axis = 1)
    return score

def calc_metric_nlp(df, response):
    embbedings = df["sys_embbedings"].values
    target = model.encode(response)
    score = [_calc_cosinus(emb, target) for emb in embbedings]
 
    return score

def ranking_by_metric(df,response, metric, topk = 10, page = 0):
    df_new = df.copy()
    df_new["similarity_score"] = metric(df, response) * df_new["reliability_float"] + 0.1*calc_metric_occurrences(df, response[0])
    if topk == -1:
        return df_new
    else:
        df_new = df_new.sort_values(["similarity_score"], ascending = [False])
        return df_new[page*topk:(page+1)*topk]

# def ranking(df,response, topk = 5):
#     df_new = df.copy()
#     df_new["similarity_score"] = metric(df, response)
#     df_new = df_new.sort_values(["similarity_score"], ascending = [False])
#     return df_new[:topk]


# In[116]:


def _max_sim(x):
    return np.max(x["similarity_score"].values)

class Ranker():
    def __init__(self, prod, supp):
        self.prod = prod
        self.supp = supp
    
    @staticmethod
    def get_responses(responses):
        #print(responses)
        responses = responses.split('|')
        responses = [resp for resp in responses if len(resp)>0]
        return responses
 
    def get_ranking_data(self, responses, page = 0, elemnts_per_page = 10, searc_by = "product", filter=None):

        if searc_by == "customer" or '|' in responses:
            responses = self.get_responses(responses)
            supp_c = self.supp.copy()
            sum_col = []
            for resp in responses:
                df = ranking_by_metric(self.prod, responses, calc_metric_nlp, -1, page)
                prod = self.prod.copy()
                temp = df.groupby('ogrn', sort=False).apply(_max_sim)
                supp_c[f'sys_{resp}'] = temp[supp_c['ogrn'].values].values
                sum_col.append(f'sys_{resp}')
            supp_c["mean_rating"] = supp_c[sum_col].mean(axis = 1)
            supp_c = supp_c.sort_values(["mean_rating"], ascending = [False])

            supp_c = supp_c[supp_c['mean_rating'] > supp_c['mean_rating'].max() * 0.82]

            length = len(supp_c.index)
            pages_count = (length // elemnts_per_page) + 1

            return pages_count, supp_c[page*elemnts_per_page:(page+1)*elemnts_per_page]
        else:
            supp_c = ranking_by_metric(self.prod, [responses], calc_metric_nlp, -1, page)
            supp_c = supp_c.sort_values(["similarity_score"], ascending=[False])

            supp_c = supp_c[supp_c['similarity_score'] > supp_c['similarity_score'].max() * 0.82]
            length = len(supp_c.index)
            pages_count = (length // elemnts_per_page) + 1
            return pages_count, supp_c[page*elemnts_per_page:(page+1)*elemnts_per_page]


r = Ranker(prod, supp)
if __name__ == "__main__":
    response = "ноутбук"
    pages_count, df = r.get_ranking_data(response, page = 0, searc_by = "222")

    print(df['name'])



