import asyncio
import pathlib
import ssl
# import websockets
import json
from cortex import Cortex
from secrets import secrets
import threading


#WORKING THROUGH CORTEX

# User object to send to Cortex
jake_user = {
    'client_id': secrets['client_id'],
    'client_secret': secrets['client_secret'],
    "headset_id": secrets['headset_id'],
    "license": "", #don't generally need to specify license - cortext should find it based on client_id
    "debit": 100
}

#Crete an instance of Cortext to use
jake = Cortex(jake_user)

#Make sure things are working
print(jake)
print(jake.ws)



                    #Testing Cortex Wrapper Functions


jake.get_cortex_info()
#Query my headset when turned on and connected to EMOTIV App
query_headset_resp = jake.query_headset()
print(query_headset_resp)

#Waits to connect headset - doesn't connect it on my end even if found. Not quite sure how to use
# connect_headset_resp = jake.connect_headset(jake_user['headset_id'])
# print(connect_headset_resp)

request_access_resp = jake.request_access()
print(request_access_resp)

authorize_resp = jake.authorize()
print(authorize_resp)
token = authorize_resp

# create_session_resp = jake.create_session(token, jake_user['headset_id'])
# print(create_session_resp)
# jake.create_session(token, jake_user['headset_id'])
# jake.close_session()
# jake.get_cortex_info()


# Confused about how to extract data from the headset
# def get_data_at_interval():
#     interval = 3
#     threading.Timer(interval, get_data_at_interval).start()
#     print("Timer working")
#     data = jake.extract_data_labels("mot",["col0", "col1"] )
#     print(data)



jake.do_prepare_steps()
jake.sub_request(["mot"])
# get_data_at_interval()


#connect headset doesn't work behind the scenes either it just freezes out I think
# jake.connect_headset(jake_user['headset_id'])
#disconnect headset works
# jake.disconnect_headset()




