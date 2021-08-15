import asyncio
import pathlib
import ssl
import websockets
import json
# from cortex import Cortex





#Setup a websocket connection to the Cortex API from Emotiv
async def hello():

    uri = "wss://localhost:6868"

    async with websockets.connect(
        uri, ssl=True
    ) as websocket:

        #checking connection
        greeting = '{"id":1,"jsonrpc":"2.0","method":"getCortexInfo"}'
        await websocket.send(greeting)
        response = await websocket.recv()
        print(f"< {response}")

        access_request = '{"id":1,"jsonrpc":"2.0","method":"requestAccess", "params": {"clientId": "hVe4d7WF19ObiuGfJKL8yYo7aivjP692nWHiRzJw", "clientSecret": "rjtEBdSANn6JGE6LsgrrgZdA9dKlItdF1d4w1inJx5iyGI3MjZD6Wus5BnLoaa3koMhIH1eOJ8U75VIUaW7DsKIicy4YyRDpJFP1Nhcs6MgWx6HcpYyideIIWSiUKApz"}}'
        await websocket.send(access_request)
        response_access = await websocket.recv()
        print(f"< {response_access}")

        authorize_request = '{"id":1,"jsonrpc":"2.0","method":"authorize", "params": {"clientId": "hVe4d7WF19ObiuGfJKL8yYo7aivjP692nWHiRzJw", "clientSecret": "rjtEBdSANn6JGE6LsgrrgZdA9dKlItdF1d4w1inJx5iyGI3MjZD6Wus5BnLoaa3koMhIH1eOJ8U75VIUaW7DsKIicy4YyRDpJFP1Nhcs6MgWx6HcpYyideIIWSiUKApz","debit":1}}'
        await websocket.send(authorize_request)
        response_auth = await websocket.recv()
        print(f"< {response_auth}")



        #TOKEN
        token = json.loads(response_auth)['result']['cortexToken']
        print(token)



        user_info_request = '{"id":1,"jsonrpc":"2.0","method":"getUserInformation", "params": {"cortexToken":' + f'"{token}"' + '}}'
        await websocket.send(user_info_request)
        response_user_info = await websocket.recv()
        print(f"< {response_user_info}")

        license_info_request = '{"id":1,"jsonrpc":"2.0","method":"getLicenseInfo", "params": {"cortexToken":' + f'"{token}"' + '}}'
        await websocket.send(license_info_request)
        response_license_info = await websocket.recv()
        print(f"< {response_license_info}")



        query_headset = '{"id":1,"jsonrpc":"2.0","method":"queryHeadsets", "params": {"id":"INSIGHT-A2D203D1"}}'
        await websocket.send(query_headset)
        response_query = await websocket.recv()
        print(f"<{response_query}")

        session_request = '{"id":1,"jsonrpc":"2.0","method":"createSession", "params": {"cortexToken":' + f'"{token}",' + '"headset":"INSIGHT-A2D203D1","status":"active"}}'
        await websocket.send(session_request)
        response_open_session = await websocket.recv()
        print(f"<{response_open_session}")

        current_session = '{"id":1,"jsonrpc":"2.0","method":"querySessions", "params": {"cortexToken":' + f'"{token}"' + '}}'
        await websocket.send(current_session)
        response_current_session = await websocket.recv()

        #Session ID
        session_id = json.loads(response_current_session)['result'][0]['id']
        print(f"<Session_id: ******* {session_id}")


        stream = '{"id":1,"jsonrpc":"2.0","method":"subscribe", "params": {"cortexToken":' + f'"{token}"' + '"session":' + f'"{session_id}",' + '"streams":["mot"]}}'
        await websocket.send(stream)
        response_stream = await websocket.recv()

        # {"error":{"code":-32700,"data":{"behavior":"unterminated object at offset 404"},"message":"Parse Error."},"id":null,"jsonrpc":"2.0"}
        # print(response_stream)


        # unstream = '{"id":1,"jsonrpc":"2.0","method":"unsubscribe", "params": {"cortexToken":' + f'"{token}"' + '"session":' + f'"{session_id}",' + '"streams":["mot"]}}'
        # await websocket.send(unstream)
        # response_unstream = await websocket.recv()
        # print(f"<Subscription: ******* {response_unstream}")


# "INSIGHT-A2D203D1"
asyncio.get_event_loop().run_until_complete(hello())
