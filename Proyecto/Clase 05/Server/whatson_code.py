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

uri = r"mongodb+srv://user_web:LabWeb2020@webapp.7rzpk.mongodb.net/AllMightyBudget?retryWrites=true&w=majority"
db = None


request_data = {
            "assistant_api_key": "dgQodFXmxd5B5TeRNripxUSNGJ0SGFD95HVJlO9CRj9y",
            #Solo copiar hasta antes de v2/assistants
            "assistant_url": "https://api.us-south.assistant.watson.cloud.ibm.com/instances/83f871e3-becc-4fc1-be4b-f8ef3d87ae0c",
            "assistant_version": "2019-02-28",
            "assistant_id": "851e8e2a-9417-4cb8-994b-47e273fd6249",
            "session_id":        '49fbcad3-d85b-4655-8e8c-a344df9d64db'

        }
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
def query_mongo_intent(intent):
    client, db = connect_to_mongo(uri)
    query = {'intent': intent}
    found_values = query_mongo_request(db, collection, query)
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
def insert_user_msg(msg):
    resp, intent = whatson_send_bot_response(msg)
    value = {"msg" : msg, "intent": intent, "response" : resp}
    insert_mongo('user_messages', value)
    print("Message inserted into user_messages collection")

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
    request_data['session_id'] = watson_create_session()
    response = watson_response(msg)
    #print("My intent name is: ", response["response"]["output"]["intents"][0]["intent"])
    #print("My answer was : ", response["response"]["output"]["generic"][0]["text"])
    return response["response"]["output"]["generic"][0]["text"], response["response"]["output"]["intents"][0]["intent"]


#connect_to_mongo()