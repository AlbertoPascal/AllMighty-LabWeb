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
prev_intent_data = {"intent":None , "product": 'no_product', "correo":None}
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
    if product == None or product == "":
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
        
def extract_watson_info(entities, usr, text):
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
        elif entity.get("entity") == 'Correo':
            prev_intent_data["correo"] = str(text).strip()
            whatsapp.respond_in_whatsapp("Tu correo ha sido actualizado.", usr)
        elif entity.get("entity") != "sys-number":
            product = entity.get("value")
    
    #results = {'q' : has_quantity, 't': has_type, 'p': product}
    #print("Results were ", results)
    return has_quantity, has_type, product

#This method will insert a user's message to relate it to a query and retrieve an answer. 
def insert_user_msg(intent, msg, usr, product):
    
    value = {"msg" : msg, "intent": intent, "user" : usr, "product":product}
    insert_mongo('user_messages', value)
    print("Message inserted into user_messages collection")

def retrieve_mongo_whatsapp_response(msg, usr):
    if "Location:" in msg:
        msg = msg.replace("Location:", "")
        lat, longitude = msg.split(",")
        print("sending location info")
        whatsapp.fetch_closest_store(lat,longitude, usr)
    else:
        print("Starting to fetch whatsapp response")
        try:
            #first we extract info from whatson according to the message that was sent
            intent, entities = whatson_send_bot_response(msg)
            #store prev response if neccesary:
            if bool(intent):
                prev_intent_data["intent"] = intent
                if intent in ["Continuar_Compra", "Saludos", "Finalizar_Compra"]:
                    prev_intent_data["product"]='no_product'
                    buy_data["quantity"] = None
                    buy_data["type"] = None
                #then we insert eh user message in mongoDB:
           
                insert_user_msg(prev_intent_data["intent"], msg, usr, prev_intent_data["product"])
                #We interpret the messge info
                has_quantity, has_type, product = extract_watson_info(entities, usr, msg)
                #query for mongo response
            if not (intent == "Confirmación" or intent == "Email"):
                if bool(product):
                    #print("Replacing my product data for: ", product, " because value was ", bool(product))
                    prev_intent_data["product"] = product
                    
                
                response = query_mongo_response("respuestasWhatsapp",prev_intent_data["intent"], prev_intent_data["product"], has_quantity, has_type)
                
                #print("----------------------------------")
                #print(response)
                #print("---------------------------------")
                #Revisar cómo se resetean las variables. 
                for msg in response[0]["response"]:
                    if '{quantity}' in msg["message"]:
                        #print("--- my message needs to replace quantity" )
                        msg["message"] = msg["message"].replace('{quantity}', str(buy_data["quantity"]))
                        #print(msg["message"])
                        #buy_data["quantity"] = ""
                    if '{type}' in msg["message"]:
                        msg["message"] = msg["message"].replace('{type}', str(buy_data["type"]))
                        #buy_data["type"] = ""
                    if '{product}' in msg["message"]:
                        msg["message"] = msg["message"].replace('{product}', str(prev_intent_data["product"]))
                        #prev_intent_data["product"] = ""
                format_whatsapp_response(response[0].get('response'),usr)
                
            #Check if we need to add to shopping cart. 
            if (prev_intent_data["intent"] == r"Confirmación" or prev_intent_data["intent"] == "Email") and bool(prev_intent_data["product"]) and bool(buy_data["type"]) and bool(buy_data["quantity"]) and bool(prev_intent_data["correo"]):
                #We are ready to add to the cart. 
                #print("**************************************************")
                #print("STARTING TO CHECK FOR COMPLETE PRODUCT INFORMATION")
                #First we find the corresponding product id: 
                query = {'type': str(prev_intent_data["product"]) , 'name':str(buy_data["type"])}
                #print("My query: ", query)
                obj_data = general_mongo_query('productos', query)
                add_item_to_cart(obj_data[0]["_id"], buy_data["quantity"], prev_intent_data["correo"])
                #print("Item added-...........................")
                response = query_mongo_response("respuestasWhatsapp",prev_intent_data["intent"], prev_intent_data["product"], has_quantity, has_type)
                format_whatsapp_response(response[0].get('response'),usr)
                
                
            elif (prev_intent_data["intent"] == r"Confirmación") and bool(prev_intent_data["product"]) and bool(buy_data["type"]) and bool(buy_data["quantity"]):
                    #We need to ask for email first. 
                    whatsapp.respond_in_whatsapp("Por favor compártenos tu correo para que tu carrito esté preparado la próxima vez que entres a la página.", usr)
                
        except IndexError:
            #print("User sent an emoji or a sticker")
            if msg != "" and msg != None:
                whatsapp.respond_in_whatsapp(msg, usr)
            else:
                whatsapp.respond_in_whatsapp("¡Wow! Yo todavía no sé mandar eso :(", usr)
    
    #return response[0].get('response')
def get_transactions(email):
    query = {'email': email}
    transaction_data = general_mongo_query('user_transactions', query)
    if transaction_data:
        return {"termometro": transaction_data[0]["termometro"], "mascaras":transaction_data[0]["mascaras"], "pruebas":transaction_data[0]["pruebas"], "desinfectante": transaction_data[0]["desinfectante"]}
    else:
        return {"termometro":0, "mascaras":0, "pruebas":0, "desinfectante":0}
    
def complete_purchase(email):
    #add wishlist items to new user_transactions_table. 
    query = {'email': email}
    transaction_data = general_mongo_query('user_transactions', query)
    user_info = {"email":None, "termometro":0, "mascaras":0, "pruebas":0, "desinfectante":0}
    user_info["email"] = email
    wishlist_data = general_mongo_query('wishlist', query)
    #print("*****wishlist*****")
    #print(wishlist_data)
    
    if transaction_data:
        #print("There was transaction data for this user")
        for key in transaction_data[0]:
            #we keep the previous values
            user_info[key] = transaction_data[0][key]
        if (wishlist_data):
            for element in wishlist_data[0]["wishlist"]:
                #print("current element: ", element)
                query = {"_id":element["product"]}
                product_data = general_mongo_query('productos', query)  
                #print("My product data was: ", product_data)
                user_info[product_data[0]["type"]] += int(element["quantity"]) + int(transaction_data[0][product_data[0]["type"]])
                #print("user info is now: ", user_info)
            query = {'email': email}
            newvalues = { "$set": user_info }
            update_mongo('user_transactions', query, newvalues)
    else:
        #print("this is a new user")
        if (wishlist_data):
            for element in wishlist_data[0]["wishlist"]:
                query = {"_id":element["product"]}
                product_data = general_mongo_query('productos', query)   
                user_info[product_data[0]["type"]] += int(element["quantity"])
            insert_mongo('user_transactions', user_info)
    query = {"email":email}
    newvalues = {"$set": {"wishlist":[]}}
    update_mongo('wishlist', query, newvalues)
    
        
def retrieve_wishlist_products(email):
    query = {'email':email}
    final_wishlist = []
    wishlist_data = general_mongo_query('wishlist', query )
    if(wishlist_data):
        #User has a wishlist
        #print("My wishlist data: ", wishlist_data)
        for element in wishlist_data[0]["wishlist"]:
            query = {"_id":element["product"]}
            product_data = general_mongo_query('productos', query)
            #print(product_data)
            #print(element)
            item = {"id": product_data[0]["id"], "name": product_data[0]["name"], "description": product_data[0]["description"], "img":product_data[0]["img"], "price":product_data[0]["price"], "type": product_data[0]["type"], "count":element["quantity"]}
            #print("-----adding items: ---------")
            #print(item)
            final_wishlist.append(item)
        return final_wishlist
    else:
        #user has no wishlist.
        return []
def retrieve_products():
    query = {}
    product_data = general_mongo_query('productos', query )
    product_list = []
    if(product_data):
        #User has a wishlist
        #print("My wishlist data: ", product_data)
        for element in product_data:
            print(element)
            item = {"id": element["id"], "name": element["name"], "description": element["description"], "img":element["img"], "price":element["price"], "type": element["type"]}
            product_list.append(item)
            
        return product_list   
       
    else:
        #user has no wishlist.
        return []
def add_items_to_wishlist(name, item_type, email):
    
    query = {"name":name, "type": item_type}
    item_info = general_mongo_query('productos', query)
    
    if item_info:
        #product found:
        itemID = item_info[0]["_id"]
        query = {"email":email}
        wishlist_data = general_mongo_query('wishlist', query)
        wishlist = []
        try:
            wishlist = wishlist_data[0]['wishlist']
        except:
            wishlist_data = None
        if not wishlist_data:
            #create a new wishlsit for the user:
            values_to_insert = {"email": email, "wishlist": []}
            insert_mongo('wishlist', values_to_insert)
        item_exists = False
        #Check for the element id if it is already added:
        for element in wishlist:
            print("Looking in wishlist for itemID: ", itemID)
            if element["product"] == itemID:
                #item is already in wishlist. We only update this field. 
                element["quantity"] = int(element["quantity"]) + int(1)
                item_exists = True
                break
        if item_exists:
            newvalues = { "$set": {"wishlist": wishlist } }
            update_mongo('wishlist', query, newvalues)
        else:
            #Insert new value in wishlist. 
            wishlist.append({'product': itemID, 'quantity': 1})
            newvalues = { "$set": {"wishlist": wishlist } }
            update_mongo('wishlist', query, newvalues)
            
def remove_from_wishlist(name, item_type, email):
    
    query = {"name":name, "type": item_type}
    item_info = general_mongo_query('productos', query)
    
    if item_info:
        #product found:
        itemID = item_info[0]["_id"]
        query = {"email":email}
        wishlist_data = general_mongo_query('wishlist', query)
        wishlist = []
        try:
            wishlist = wishlist_data[0]['wishlist']
        except:
            wishlist_data = None
        if not wishlist_data:
            #create a new wishlsit for the user:
            values_to_insert = {"email": email, "wishlist": []}
            insert_mongo('wishlist', values_to_insert)
        item_exists = False
        #Check for the element id if it is already added:
        for element in wishlist:
            #print("Looking in wishlist for itemID: ", itemID)
            if element["product"] == itemID:
                #item is already in wishlist. We only update this field. 
                wishlist.remove(element)
                item_exists = True
                break
        if item_exists:
            newvalues = { "$set": {"wishlist": wishlist } }
            update_mongo('wishlist', query, newvalues)
          
def add_item_to_cart(itemID, quantity, usr):
    #insert_mongo(collection, values_to_insert)
    query = {'email':usr}
    obj_data = general_mongo_query('wishlist', query)
    wishlist = None
    try:
        wishlist = obj_data[0]['wishlist']
    except:
        #print("creating new wishlist. ")
        wishlist = []
        obj_data= None
    item_exists = False
    if not bool(obj_data):
        #create new wishlist for the user
        values_to_insert = {"email": usr, "wishlist": []}
        insert_mongo('wishlist', values_to_insert)
    for element in wishlist:
        print("Looking in wishlist for itemID: ", itemID)
        if element["product"] == itemID:
            #item is already in wishlist. We only update this field. 
            element["quantity"] = int(element["quantity"]) + int(quantity)
            item_exists = True
            break
    if item_exists:
        newvalues = { "$set": {"wishlist": wishlist } }
        update_mongo('wishlist', query, newvalues)
    else:
        #Insert new value in wishlist. 
        wishlist.append({'product': itemID, 'quantity': quantity})
        newvalues = { "$set": {"wishlist": wishlist } }
        update_mongo('wishlist', query, newvalues)

    
def update_mongo(collection, query, values):
    client, db = connect_to_mongo(uri)
    collection_data = db[collection]
    
    collection_data.update_one(query, values)
def format_whatsapp_response(response, usr):
    #the idea here is to return an image, pdf or stuff depending on what the whatsapp answer needs to be
    for element in response:
        print(element)
        if element["obj_type"] == 'File':
            #Send PDF. 
            #print("This would be replaced for a pdf")
            whatsapp.respond_file_in_whatsapp(element["message"], usr)
            pass
        elif element["obj_type"] == 'Text':
            #print("Message to be sent: ", element["message"])
            whatsapp.respond_in_whatsapp(element["message"],usr)
#This function will be called from jsx to retrieve all data. 
def retrieve_mongo_response(msg, usr):
    try:
        prev_intent_data["correo"] = str(usr)
	    #first we extract info from watson
        intent, entities = whatson_send_bot_response(msg)
	    #store prev response if neccesary:
        #print("********************************")
        #print("Intent: ", intent, "entities: ", entities)
        if bool(intent):
            prev_intent_data["intent"] = intent
            if intent in ["Saludos", "Continuar_Compra", "Finalizar_Compra"]:
                    prev_intent_data["product"] = "no_product"
                    buy_data["quantity"] = None
                    buy_data["type"] = None
	    
	    #We interpret the message info
        has_quantity, has_type, product = extract_watson_info(entities, usr, msg)
        #print("Looking to extract watson info:....", has_quantity, " ", has_type, " ", product)
        #print("My prev_intent data is: ", prev_intent_data, " and buy data: ", buy_data)
        if not (intent == "Confirmación" or intent == "Email"):
            if bool(product):
                #print("Replacing my product data for: ", product, " because value was ", bool(product))
                prev_intent_data["product"] = product
		    #then we insert the user message in MongoDB
            insert_user_msg(prev_intent_data["intent"] , msg, usr, prev_intent_data["product"])
	    
            if not has_quantity:
                has_quantity = bool(buy_data.get("quantity"))
            if not has_type:
                has_type = bool(buy_data.get("type"))
		    #query the intent and parameters on mongodb
            response = query_mongo_response("respuestas",prev_intent_data["intent"], prev_intent_data["product"], has_quantity, has_type)
		    
            #print("----------------------------------")
            #print(response)
            #print("---------------------------------")
            for msg in response[0]["response"]:
                if '{quantity}' in msg["message"]:
                    #print("--- my message needs to replace quantity" )
                    msg["message"] = msg["message"].replace('{quantity}', str(buy_data["quantity"]))
                    #print(msg["message"])
                    #buy_data["quantity"] = ""
                if '{type}' in msg["message"]:
                    msg["message"] = msg["message"].replace('{type}', str(buy_data["type"]))
                    #buy_data["type"] = ""
                if '{product}' in msg["message"]:
                    msg["message"] = msg["message"].replace('{product}', str(prev_intent_data["product"]))
                    #product = ""
                return response[0].get('response')
        if (prev_intent_data["intent"] == r"Confirmación" or prev_intent_data["intent"] == "Email") and bool(prev_intent_data["product"]) and bool(buy_data["type"]) and bool(buy_data["quantity"]) and bool(prev_intent_data["correo"]):
            #We are ready to add to the cart. 
            #print("**************************************************")
            #print("STARTING TO CHECK FOR COMPLETE PRODUCT INFORMATION")
            #First we find the corresponding product id: 
            query = {'type': str(prev_intent_data["product"]) , 'name':str(buy_data["type"])}
            #print("My query: ", query)
            obj_data = general_mongo_query('productos', query)
            #print("--------------------OBJ DATA--------------------")
            #print(obj_data)
            #print("query: ", query)
            #print("-------------------------------------------------")
            #print(prev_intent_data)
            #print("-------------------------------------------------")
            add_item_to_cart(obj_data[0]["_id"], buy_data["quantity"], prev_intent_data["correo"])
            #print("Item added-...........................")
            response = query_mongo_response("respuestasWhatsapp",prev_intent_data["intent"], prev_intent_data["product"], has_quantity, has_type)
            
            return response[0].get('response')
                     
    except IndexError:
        print("User sent something else")
    
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
        #print("Sending message")
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
    #print("Entering send_bot_response module")
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