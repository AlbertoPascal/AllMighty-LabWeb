# -*- coding: utf-8 -*-
"""
Created on Tue Oct 13 21:00:13 2020

@author: beto_
"""

# Download the helper library from https://www.twilio.com/docs/python/install
from twilio.rest import Client
from dotenv import load_dotenv
import os


# Your Account Sid and Auth Token from twilio.com/console
# DANGER! This is insecure. See http://twil.io/secure
load_dotenv()
account_sid = os.getenv('ACCOUNT_SID')
auth_token = os.getenv('AUTH_TOKEN')
client = Client(account_sid, auth_token)

def respond_in_whatsapp(message, number):
    
    message = client.messages.create(
                                  body=message,
                                  from_='whatsapp:+14155238886',
                                  to= str(number)
                              )
    
    print(message.sid)