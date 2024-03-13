import pickle
import json
import numpy as np

__complete_skills_list = None
__count_vector = None
__tfidf_transformer = None
__data_science_classifier = None
__in_demand_skills_0 = None
__in_demand_skills_1 = None
__in_demand_skills_2 = None

def load_artifacts():

    global __complete_skills_list
    global __count_vector
    global __tfidf_transformer
    global __data_science_classifier
    global __in_demand_skills_0
    global __in_demand_skills_1
    global __in_demand_skills_2


    with open('artifacts/complete_skills_list.json', 'r') as f:
        __complete_skills_list = json.load(f)

    with open('artifacts/count_vector.pickle', 'rb') as f:
        __count_vector = pickle.load(f)

    with open('artifacts/tfidf_transformer.pickle', 'rb') as f:
        __tfidf_transformer = pickle.load(f)

    with open('artifacts/data_science_classifier_final.pickle', 'rb') as f:
        __data_science_classifier = pickle.load(f)

    with open('artifacts/in_demand_skills_0.json', 'r') as f:
        __in_demand_skills_0 = json.load(f)

    with open('artifacts/in_demand_skills_1.json', 'r') as f:
        __in_demand_skills_1 = json.load(f)

    with open('artifacts/in_demand_skills_2.json', 'r') as f:
        __in_demand_skills_2 = json.load(f)


def complete_skills_list():
    return __complete_skills_list


def prediction(selected_skills):
    skills_str = ",".join(selected_skills)
    skills_vector = __count_vector.transform([skills_str])
    skills_tfidf = __tfidf_transformer.transform(skills_vector)

    result = __data_science_classifier.predict(skills_tfidf)
    probabilities = np.around(__data_science_classifier.predict_proba(skills_tfidf) * 100, 2).tolist()[0]

    job_roles = {0: "Data Scientist", 1: "Data Analyst", 2: "Data Engineer"}
    result_label = job_roles.get(result[0], "Unknown")

    return result_label, probabilities

def missing_skills_analysis(selected_skills,position):
    ds_skills = list(__in_demand_skills_0.keys())
    da_skills = list(__in_demand_skills_1.keys())
    de_skills = list(__in_demand_skills_2.keys())
    skills = selected_skills.split(',')
    n0 = len(ds_skills)
    n1 = len(da_skills)
    n2 = len(de_skills)
    n = 0

    if position.lower() == 'data scientist':
        for s in skills:
            if s.lower() in ds_skills:
                n += 1
                ds_skills.remove(s.lower())
        percent = round((n / n0) * 100, 2)
        percent_covered_str = f'{percent}%'
        skills_left_str = ','.join(ds_skills)

    elif position.lower() == 'data analyst':
        for s in skills:
            if s.lower() in da_skills:
                n += 1
                da_skills.remove(s.lower())
        percent = round((n / n1) * 100, 2)
        percent_covered_str = f'{percent}%'
        skills_left_str = ','.join(da_skills)

    else:
        for s in skills:
            if s.lower() in de_skills:
                n += 1
                de_skills.remove(s.lower())
        percent = round((n / n2) * 100, 2)
        percent_covered_str = f'{percent}%'
        skills_left_str = ','.join(de_skills)
    return percent_covered_str,skills_left_str


if __name__ == '__main__':
    load_artifacts()