#!/usr/bin/env python

# WSS (WS over TLS) client example, with a self-signed certificate

import asyncio
import pathlib
import ssl
import websockets
import json

async def hello():

    uri = "wss://localhost:6868"

    async with websockets.connect(
        uri, ssl=True
    ) as websocket:

        greeting = '{"id":1,"jsonrpc":"2.0","method":"getCortexInfo"}'
        
        await websocket.send(greeting)
        print(f"> {greeting}")
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
        print(response_query)


        session_request = '{"id":1,"jsonrpc":"2.0","method":"createSession", "params": {"cortexToken":' + f'"{token}",' + '"headset":"INSIGHT-A2D203D1","status":"active"}}'
        await websocket.send(session_request)
        response_open_session = await websocket.recv()
        print(response_open_session)



# "INSIGHT-A2D203D1"
asyncio.get_event_loop().run_until_complete(hello())