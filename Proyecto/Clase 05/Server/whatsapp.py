# -*- coding: utf-8 -*-
"""
Created on Tue Oct 13 21:00:13 2020
@author: beto_
"""

# Download the helper library from https://www.twilio.com/docs/python/install
import geopy
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter

from twilio.rest import Client
from dotenv import load_dotenv
import os
import sys
import pymongo
import whatson_code
import math
uri = r"mongodb+srv://user_web:LabWeb2020@webapp.7rzpk.mongodb.net/AllMightyHealth?retryWrites=true&w=majority"
db = None

# Your Account Sid and Auth Token from twilio.com/console
# DANGER! This is insecure. See http://twil.io/secure
load_dotenv()
account_sid = os.getenv('ACCOUNT_SID')
auth_token = os.getenv('AUTH_TOKEN')

client = Client(account_sid, auth_token)


def respond_file_in_whatsapp(filename, number):
    curr_dir = os.getcwd()
    print("Filename was: ", filename)
    message = None
    if filename == 'termometro.pdf':       
        message = client.messages.create(
                    body='',
                    from_ = 'whatsapp:+14155238886',
                    to = str(number),
                    media_url = "https://docs.google.com/uc?export=download&id=14cLMZXmXvhTBpbM9M8xTP-tShCnJxguM",
                    
                )
    elif filename == 'catalogo_full.pdf':
        message = client.messages.create(
            body='',
            from_ = 'whatsapp:+14155238886',
            to = str(number),
            media_url = "https://docs.google.com/uc?export=download&id=1cSFidwdnS42XbIrzLloeDAhI0hTvq4Nh",
            
        )
    elif filename == 'cubrebocas.pdf':
        message = client.messages.create(
            body='',
            from_ = 'whatsapp:+14155238886',
            to = str(number),
            media_url = "https://docs.google.com/uc?export=download&id=1ZXNwfzPn00OFAf1P2VDFvT0CWgntGhb_",
            
        )
    elif filename == 'desinfectante.pdf':
        message = client.messages.create(
            body='',
            from_ = 'whatsapp:+14155238886',
            to = str(number),
            media_url = "https://docs.google.com/uc?export=download&id=1UHnkKVmAJyXZdkIwMFAZcIu6GKGUU767",
            
        )
    elif filename == 'pruebas.pdf':
        message = client.messages.create(
            body='',
            from_ = 'whatsapp:+14155238886',
            to = str(number),
            media_url = "https://docs.google.com/uc?export=download&id=1XDVZAKMWA_A4VeXWJ4r5H5lBbXBRdST4",
            
        )
    print("Message sent! Sid: ", message.sid)
def respond_in_whatsapp(message, number):
    print("connection data: ", account_sid, auth_token) 
    print('ENTERING TO SEND WHATSAPP MESSAGE ', client)
    message = client.messages.create(
                                  body=message,
                                  from_='whatsapp:+14155238886',
                                  to= str(number)
                              )
    
    print(message.sid)

def fetch_closest_store(lat, longitude, number):
    locator = Nominatim(user_agent="google")
    coordinates = str(lat) + ", " + str(longitude)
    location = locator.reverse(coordinates)
    short_lat, short_long = distance_between_points(float(lat), float(longitude))
    print("Received shortest: ", short_lat, " and ", short_long)
    temp_coords = str(short_lat) + "," + str(short_long)
    print("tempral coords has: ", temp_coords)
    temp_location = locator.reverse(temp_coords)
    
    body_msg = "La tienda más cercana a '" + str(location.raw["display_name"]) + "' se encuentra en '" + str(temp_location.raw["display_name"]) + "'."
    print(body_msg)
    location_no_spaces = temp_location.raw["display_name"]
    while " " in location_no_spaces:
        location_no_spaces = location_no_spaces.replace(" ", "+")
    print(location_no_spaces)
    google_maps_url = r"https://www.google.com.mx/maps/dir/" + lat + "," + longitude +r"/"+ str(short_lat) + "," + str(short_long)#r"{}".format(str(location_no_spaces))
    message = client.messages.create(
                body= body_msg,
                from_= "whatsapp:+14155238886",
                #PersistentAction= "geo:37.787890,-122.391664",
                to=str(number)
                )
    message = client.messages.create(
                body= google_maps_url,
                from_= "whatsapp:+14155238886",
                #PersistentAction= "geo:37.787890,-122.391664",
                to=str(number)
                )
def distance_between_points(from_lat, from_long):
    query = {}
    sucursales = whatson_code.general_mongo_query('sucursales', query)
    shortest_distance = sys.maxsize
    shortest_lat = None
    shortest_long = None
    for sucursal in sucursales:
        lat= sucursal["latitud"]
        long_ = sucursal["longitud"]
        print("lat: ", lat, " long:", long_ )
        distance = math.sqrt(math.pow(float(lat)-float(from_lat),2) + math.pow(float(long_) - float(from_long),2))
        if distance < shortest_distance:
            shortest_distance = distance
            shortest_lat = float(lat)
            shortest_long = float(long_)
    return shortest_lat, shortest_long