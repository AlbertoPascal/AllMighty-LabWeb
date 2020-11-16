
# API
import os
import json
import logging
import requests

import flask
from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from dotenv import load_dotenv
from flask_api import status

from jsonschema import validate, ValidationError
from ibm_watson import AssistantV2, ApiException
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from flask import jsonify
import whatson_code
import whatsapp

load_dotenv()

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

assistant_api_key = os.getenv("assistant_api_key")


class GET_MESSAGE(Resource):
    def post(self):
        print(request.json)
        msg = request.json["message"]
        usr = request.json["user"]
        responses = whatson_code.retrieve_mongo_response(msg, usr)
        print("My response was : ", responses)
        for element in responses:
            print("msg: ", element)
        print("-----------------------")
        print(responses)
        return jsonify( response = responses)

class GET_INTENT(Resource):
    def post(self):
        print(request.json)
        msg = request.json["intent"]
        usr = request.json["user"]
        resp,intent = whatson_code.retrieve_mongo_response(msg, usr)
        return jsonify(este_es_el_intent = intent)
    
class WHATSAPP_MESSAGE(Resource):
    def post(self):
        print("contenido: ", request.form)
        message = request.form['Body']
        if not message:
            message = 'Location:' + request.form['Latitude'] + ',' + request.form['Longitude']
        user = request.form['From']
        print('Message: ', message)
        print('User: ', user)
        #whatsapp.respond_in_whatsapp(message, user)
        print("Sending message....")
        whatson_code.retrieve_mongo_whatsapp_response(message, user)
        
        return jsonify(test_response = "test")
    
class GET_WISHLIST(Resource):
    def post(self):
        print("Fetching wishlist")
        usr = request.json["user"]
        products = whatson_code.retrieve_wishlist_products(usr)
        return jsonify(wishlist = products)
class GET_PRODUCTS(Resource):
    def post(self):
        print("Fetching avaliable products")
        #usr = request.json["user"]
        products = whatson_code.retrieve_products()
        print("products remaining: ", products)
        return jsonify(product_list = products)

class ADD_PRODUCTS(Resource):
    def post(self):
        print("Fetching avaliable products")
        name = request.json["name"]
        type_ = request.json["type"]
        email = request.json["email"]
        whatson_code.add_items_to_wishlist(name, type_, email)
        print("products added")
        return jsonify(msg = "Se agregó el producto al carrito")

class REMOVE_PRODUCTS(Resource):
    def post(self):
        print("Removing product")
        name = request.json["name"]
        type_ = request.json["type"]
        email = request.json["email"]
        whatson_code.remove_from_wishlist(name, type_, email)
        print("products removed")
        return jsonify(msg = "Se quitó el producto del carrito")

api.add_resource(GET_MESSAGE, '/getMessage')  # Route_1
api.add_resource(GET_INTENT, '/getIntent')
api.add_resource(WHATSAPP_MESSAGE, '/whatsapp_response')
api.add_resource(GET_WISHLIST, '/getWishlist')
api.add_resource(GET_PRODUCTS, '/getProducts')
api.add_resource(ADD_PRODUCTS, '/addProduct')
api.add_resource(REMOVE_PRODUCTS, '/removeProduct')

if __name__ == '__main__':
    app.run(port='5002')
