# -*- coding: utf-8 -*-
"""
Created on Tue Oct 13 21:00:13 2020

@author: beto_
"""

# Download the helper library from https://www.twilio.com/docs/python/install
from twilio.rest import Client


# Your Account Sid and Auth Token from twilio.com/console
# DANGER! This is insecure. See http://twil.io/secure
account_sid = 'ACbaec6b6ed7aa88025cdfcf672a697138'
auth_token = '93b2ed65745272897fd68716691e5ebe'
client = Client(account_sid, auth_token)

def respond_in_whatsapp(message, number):
    
    message = client.messages.create(
                                  body=message,
                                  from_='whatsapp:+14155238886',
                                  to='whatsapp:' + str(number)
                              )
    
    print(message.sid)