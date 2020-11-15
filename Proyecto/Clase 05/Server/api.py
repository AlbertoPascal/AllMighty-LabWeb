
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
    
    
api.add_resource(GET_MESSAGE, '/getMessage')  # Route_1
api.add_resource(GET_INTENT, '/getIntent')
api.add_resource(WHATSAPP_MESSAGE, '/whatsapp_response')

if __name__ == '__main__':
    app.run(port='5002')
