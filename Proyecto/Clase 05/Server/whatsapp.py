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