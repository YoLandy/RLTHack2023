#!/usr/bin/env python
# coding: utf-8

# In[2]:


import requests
import bs4
import json
import sys
sys.path.insert(0, '../')  # добавляем путь к папке верхнего уровня
sys.path.insert(0, '.../')


# In[9]:


import pandas as pd
import re
import numpy as np


# In[10]:


from sentence_transformers import SentenceTransformer
model = SentenceTransformer('DeepPavlov/rubert-base-cased-sentence')



# In[14]:


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
    return np.mean(matchings)

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

def ranking_by_metric(df,response, metric, topk = 5):
    df_new = df.copy()
    df_new["similarity_score"] = metric(df, response)
    df_new = df_new.sort_values(["similarity_score"], ascending = [False])
    return df_new[:topk]

def ranking(df,response, topk = 5):
    df_new = df.copy()
    df_new["similarity_score"] = metric(df, response)
    df_new = df_new.sort_values(["similarity_score"], ascending = [False])
    return df_new[:topk]


# In[19]:






# In[ ]:




