import os
from flask import Flask, render_template, request, flash, redirect, session, g
from flask_socketio import SocketIO, send

                    #FLASK APP CONFIG

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")
socketio = SocketIO(app)



@socketio.on('message')
def handle_message(msg):
    print('message:' + msg)
    send(msg, broadcast=True)

if __name__=='__main__':
    socketio.run(app)