import websockets
import asyncio

PORT = 7890

print(f'Started the server - listening on port {PORT}')

#on websocket connection, server will perform the following
async def echo(websocket, path):
    print('Someone new connected to the socket')

    #When a message is received from the client, we acknowledge and echo it back with spice
    try:
        async for message in websocket:
            print(f"Received message from the client: {message}")
            #Sends a message back to the client
            await websocket.send(f'Well, {message} you as well, SpiceLord.')
    except websockets.exceptions.ConnectionClosed as e:
        print("A client just disconnected")
        print(e)
#returns an instance of the server
start_server =  websockets.serve(echo, "localhost", PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()