import requests as rq
import json

def GETS(api_endpoint,headerObj):
    res = rq.get(url=api_endpoint,headers = headerObj)
    print(res.text)
    return res

def POSTS(api_endpoint,headerObj,data):
    data_json = json.dumps(data)
    res = rq.post(url=api_endpoint,data=data_json,headers=headerObj)
    print(res.text)
    return res

def PUTS(api_endpoint,headerObj,data):
    data_json = json.dumps(data)
    res = rq.put(url=api_endpoint,data=data_json,headers=headerObj)
    print(res.text)
    return res

def DELETES(api_endpoint,headerObj):
    res = rq.delete(url=api_endpoint,headers=headerObj)
    print(res.text)
    return res


if __name__ == "__main__":
    api_endpoint = "http://127.0.0.1:3001/"
    headerObj = {"Content-Type":"application/json"}
    GETS(api_endpoint,headerObj)
