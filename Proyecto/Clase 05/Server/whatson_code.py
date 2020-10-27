# -*- coding: utf-8 -*-
"""
Created on Mon Aug 31 21:12:49 2020

@author: beto_
"""

import os
import json
import logging
import requests

from jsonschema import validate, ValidationError
from ibm_watson import AssistantV2, ApiException
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from flask import jsonify
from flask_api import status

#MongoDB management
import sys
import pymongo
import whatsapp

uri = r"mongodb+srv://user_web:LabWeb2020@webapp.7rzpk.mongodb.net/AllMightyHealth?retryWrites=true&w=majority"
db = None
prev_intent_data = {}
buy_data = {}

request_data = {
            "assistant_api_key": "dgQodFXmxd5B5TeRNripxUSNGJ0SGFD95HVJlO9CRj9y",
            #Solo copiar hasta antes de v2/assistants
            "assistant_url": "https://api.us-south.assistant.watson.cloud.ibm.com/instances/83f871e3-becc-4fc1-be4b-f8ef3d87ae0c",
            "assistant_version": "2019-02-28",
            "assistant_id": "851e8e2a-9417-4cb8-994b-47e273fd6249",
            "session_id":        '49fbcad3-d85b-4655-8e8c-a344df9d64db'

        }
def copy_collection(collection):
    global uri
    client = pymongo.MongoClient(uri)
    db = client.get_default_database()
    col1 = db['respuestas']
    col2 = db['respuestasWhatsapp']
    for a in col1.find():
        try:
            col2.insert(a)
            print(a)
        except:
            print('did not copy')
def connect_to_mongo(uri):
    #global db, uri
    client = pymongo.MongoClient(uri) 
    print(client)
    db = client.get_default_database()
    #Allmightiness = db[collection]
    #print("------------------")
    #print(Allmightiness)
    
    #cursor = Allmightiness.find({"currency": "MXN"})
    
    #for value in cursor:
    #    print(value)
    return client, db
#No buscar solo el intent sino también los demás: entity, type, etc...
def query_mongo_response(collection, intent, product, has_quantity, has_type):
    client, db = connect_to_mongo(uri)
    if product == None:
        product = "no_product"
    query = {'intent': intent, 'product': product, 'has_quantity': has_quantity, 'has_type': has_type}
    found_values = query_mongo_request(db, collection, query)
    print("-----------------------------------------")
    print("My query would be: ", query)
    print("-----------------------------------------")
    return found_values
def query_mongo_request(db, collection, query):
    values = []
    collection_data = db[collection]
    
    cursor = collection_data.find(query)
    for val in cursor:
        values.append(val)
    return values
def general_mongo_query(collection, query):
    client, db = connect_to_mongo(uri)
    found_values = query_mongo_request(db, collection, query )
    return found_values

def insert_mongo(collection, values_to_insert):
    client, db = connect_to_mongo(uri)
    collection_data = db[collection]
    if type(values_to_insert) == type(list()):
        #tengo más de un valor por insertar. 
        for value in values_to_insert:
            collection_data.insert_one(value)
            print("Inserted value :", value, " to   collection ", collection_data.name)
    else:
        collection_data.insert_one(values_to_insert)
        print("Inserted value :", values_to_insert, " to collection ", collection_data.name)
        
def extract_watson_info(entities):
    has_quantity = False
    has_type = False
    product = None
    
    for entity in entities:
        print("first entity is: ", entity)
        
        if entity.get("entity") == 'sys-number' and not has_quantity:
            try:
                buy_data["quantity"] = int(entity["value"])
                has_quantity = (int(entity["value"])>0)
            except TypeError:
                print("Not a number")            
        elif entity.get("entity") in ('Tipo_termometro', 'Tipos_desinfectante', 'Tipos_mascaras', 'Tipos_pruebas'):
            buy_data["type"] = entity["value"]
            has_type = True
        elif entity.get("entity") != "sys-number":
            product = entity.get("value")
    
    #results = {'q' : has_quantity, 't': has_type, 'p': product}
    #print("Results were ", results)
    return has_quantity, has_type, product

#This method will insert a user's message to relate it to a query and retrieve an answer. 
def insert_user_msg(intent, msg, usr):
    
    value = {"msg" : msg, "intent": intent, "user" : usr}
    insert_mongo('user_messages', value)
    print("Message inserted into user_messages collection")

def retrieve_mongo_whatsapp_response(msg, usr):
    print("Starting to fetch whatsapp response")
    #first we extract info from whatson according to the message that was sent
    intent, entities = whatson_send_bot_response(msg)
    #store prev response if neccesary:
    if bool(intent):
        prev_intent_data["intent"] = intent
    #then we insert eh user message in mongoDB:
    insert_user_msg(prev_intent_data["intent"], msg, usr)
    #We interpret the messge info
    has_quantity, has_type, product = extract_watson_info(entities)
    #query for mongo response
    if bool(product):
        print("Replacing my product data for: ", product, " because value was ", bool(product))
        prev_intent_data["product"] = product
    
    response = query_mongo_response("respuestasWhatsapp",prev_intent_data["intent"], prev_intent_data["product"], has_quantity, has_type)
    
    print("----------------------------------")
    print(response)
    print("---------------------------------")
    for msg in response[0]["response"]:
        if '{quantity}' in msg["message"]:
            print("--- my message needs to replace quantity" )
            msg["message"] = msg["message"].replace('{quantity}', str(buy_data["quantity"]))
            print(msg["message"])
            buy_data["quantity"] = ""
        if '{type}' in msg["message"]:
            msg["message"] = msg["message"].replace('{type}', str(buy_data["type"]))
            buy_data["type"] = ""
        if '{product}' in msg["message"]:
            msg["message"] = msg["message"].replace('{product}', str(prev_intent_data["product"]))
            prev_intent_data["product"] = ""
    format_whatsapp_response(response[0].get('response'),usr)
    
    #return response[0].get('response')
def format_whatsapp_response(response, usr):
    #the idea here is to return an image, pdf or stuff depending on what the whatsapp answer needs to be
    for element in response:
        print(element)
        if element["obj_type"] == 'Carousel':
            #Send PDF. 
            pass
        elif element["obj_type"] == 'Text':
            print("Message to be sent: ", element["message"])
            whatsapp.respond_in_whatsapp(element["message"],usr)
#This function will be called from jsx to retrieve all data. 
def retrieve_mongo_response(msg, usr):
    #first we extract info from watson
    intent, entities = whatson_send_bot_response(msg)
    if bool(intent):
        prev_intent_data["intent"] = intent
        prev_intent_data["product"] = "no_product"
        buy_data["quantity"] = None
        buy_data["type"] = None
    #then we insert the user message in MongoDB
    insert_user_msg(prev_intent_data["intent"] , msg, usr)
    #We interpret the message info
    
    has_quantity, has_type, product = extract_watson_info(entities)
    
    if bool(product):
        print("Replacing my product data for: ", product, " because value was ", bool(product))
        prev_intent_data["product"] = product
    
    if not has_quantity:
        has_quantity = bool(buy_data.get("quantity"))
    if not has_type:
        has_type = bool(buy_data.get("type"))
    #query the intent and parameters on mongodb
    response = query_mongo_response("respuestas",prev_intent_data["intent"], prev_intent_data["product"], has_quantity, has_type)
    
    print("----------------------------------")
    print(response)
    print("---------------------------------")
    for msg in response[0]["response"]:
        if '{quantity}' in msg["message"]:
            print("--- my message needs to replace quantity" )
            msg["message"] = msg["message"].replace('{quantity}', str(buy_data["quantity"]))
            print(msg["message"])
            buy_data["quantity"] = ""
        if '{type}' in msg["message"]:
            msg["message"] = msg["message"].replace('{type}', str(buy_data["type"]))
            buy_data["type"] = ""
        if '{product}' in msg["message"]:
            msg["message"] = msg["message"].replace('{product}', str(prev_intent_data["product"]))
            product = ""
    return response[0].get('response')
    
def watson_create_session():


    
    iam_apikey = request_data.get("assistant_api_key")
    assistant_url = request_data.get("assistant_url")
    assistant_version = request_data.get('assistant_version')

    assistant = watson_instance(iam_apikey, assistant_url, assistant_version)

    try:
        watson_session = assistant.create_session(
            assistant_id=request_data.get("assistant_id")
        ).get_result()
        watson_session_id = watson_session["session_id"]
    except KeyError:
        _logger.error("The session wasn't created")
        return jsonify({"error": "Error creating the session"}), status.HTTP_503_SERVICE_UNAVAILABLE
    print("Session created: ", watson_session_id)
    return watson_session_id


def watson_response(message):
    
    iam_apikey = request_data.get("assistant_api_key")
    assistant_url = request_data.get("assistant_url")
    assistant_version = request_data.get('assistant_version')

    assistant = watson_instance(iam_apikey, assistant_url, assistant_version)
    context = request_data.get('context') if 'context' in request_data else {}
    watson_session_id = request_data.get('session_id')

    try:
        print("Sending message")
        watson_response = assistant.message(
            assistant_id=request_data.get('assistant_id'),
            session_id=watson_session_id,
            input={
                'message_type': 'text',
                'text': message,
                'options': {
                    'return_context': True
                }
            },
            context=context
        ).get_result()
    except ValueError as ex:
        _logger.error("Value error: %s", ex)
        return jsonify({'error': "Value error"}), status.HTTP_500_INTERNAL_SERVER_ERROR
    except ApiException:
        try:
            watson_session = assistant.create_session(
                assistant_id=request_data.get("assistant_id")
            ).get_result()
            watson_session_id = watson_session["session_id"]

            watson_response = assistant.message(
                assistant_id=request_data.get('assistant_id'),
                session_id=watson_session_id,
                input={
                    'message_type': 'text',
                    'text': request_data.get(message),
                    'options': {
                        'return_context': True
                    }
                },
                context=context
            ).get_result()
        except KeyError:
            _logger.error("The session wasn't created")
            return jsonify({"error": "Error creating the session"}), status.HTTP_503_SERVICE_UNAVAILABLE

    try:
        del watson_response["context"]["global"]["session_id"]
    except:
        pass

    response = {
        "response": watson_response,
        "session_id": watson_session_id
    }

    return response

def watson_instance(iam_apikey: str, url: str, version: str = "2019-02-28") -> AssistantV2:
    try:
        authenticator = IAMAuthenticator(iam_apikey)
        assistant = AssistantV2(
            authenticator=authenticator,
            version=version
        )
        assistant.set_service_url(url)
    except ApiException as error:
        _logger.error("%s - %s", error.code, error.message)
        return jsonify({'error': str(error.message)}), error.code

    return assistant

def whatson_send_bot_response(msg):
    print("Entering send_bot_response module")
    request_data['session_id'] = watson_create_session()
    response = watson_response(msg)
    #print("My intent name is: ", response["response"]["output"]["intents"][0]["intent"])
    #print("My answer was : ", response["response"]["output"]["generic"][0]["text"])
    print(response)
    try:
        return response["response"]["output"]["intents"][0]["intent"], response["response"]["output"]["entities"]
    except IndexError:
        return None, response["response"]["output"]["entities"]

#connect_to_mongo()