import os
# # from flask_debugtoolbar import DebugToolbarExtension
from threading import Lock
from flask import Flask, render_template, request, redirect, session, g, \
    copy_current_request_context
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
# from models import db, connect_db, User 
from random import randint
from cortex import Cortex, jake_data
# import pdb



                    # FLASK APP CONFIG



# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None
app = Flask(__name__)
# # Get DB_URI from environ variable (useful for production/testing) or,
# # if not set there, use development local db.
app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgresql:///emotify'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SQLALCHEMY_ECHO'] = False
# app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = True
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")
# # toolbar = DebugToolbarExtension(app)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()
import json

# connect_db(app)


                    # GLOBALS

# CURR_USER_KEY = "curr_user"



                    # SERVER THREADING

def background_thread():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        number = randint(0,5)
        socketio.sleep(3)
        count += 1
        socketio.emit('data_response',
                      {'data': jake_data, 'count': count})
#I need to set up a socket with Emotiv as well, which constantly emits the data like this thread instead of printing it.



#-----------------------------------------------------------------
                    #Cortex Connection
#-----------------------------------------------------------------



#User object in Cortex Class for auth.
jake_user = {
    'client_id': 'hVe4d7WF19ObiuGfJKL8yYo7aivjP692nWHiRzJw',
    'client_secret': 'rjtEBdSANn6JGE6LsgrrgZdA9dKlItdF1d4w1inJx5iyGI3MjZD6Wus5BnLoaa3koMhIH1eOJ8U75VIUaW7DsKIicy4YyRDpJFP1Nhcs6MgWx6HcpYyideIIWSiUKApz',
    "headset_id": "INSIGHT-A2D203D1",
    "license": "", #don't generally need to specify license - cortext should find it based on client_id
    "debit": 100
}
profile_name = 'Jake Main'

def open_stream():

    # Init Cortex Instance
    jake = Cortex(jake_user)

    # do preparation/auth steps
    jake.do_prepare_steps()

    # load existed profile
    profiles = jake.query_profile()
    if profile_name in profiles:
        status = 'load'
        jake.setup_profile(profile_name, status)
    else:
        print(f"Profile {profile_name} does not exist.")

    # # get active actions
    jake.get_mental_command_active_action(profile_name)

    # get sensitivity values of actions
    jake.get_mental_command_action_sensitivity(profile_name)

    # set sensitivity for active actions
    values = [7,7,5,5]
    jake.set_mental_command_action_sensitivity(profile_name, values)

    # live mental command data
    jake.sub_request(stream=['com'])



#----------------------------------------------------------------------
                    # APP VIEW FUNCTIONS
#----------------------------------------------------------------------



                    # USER LOGIN HANDLERS

# @app.before_request
# def add_user_to_g():
#     """If we're logged in, add curr user to Flask global."""

#     if CURR_USER_KEY in session:
#         g.user = User.query.get(session[CURR_USER_KEY])
#     else:
#         g.user = None

# def do_login(user):
#     """Log in a User."""

#     session[CURR_USER_KEY] = user.id

# def do_logout():
#     """Logout a User."""

#     if CURR_USER_KEY in session:
#         del session[CURR_USER_KEY]



                    # MAIN VIEW FUNCTIONS

@app.route('/')
def index():
    """Display home if logged in or home-anon if user not in session"""

    # if g.user:
    #     return render_template('index.html', async_mode=socketio.async_mode)
    # else:
    #     return render_template('index-anon.html')
    return render_template('index.html', async_mode=socketio.async_mode)

#rendering the HTML page which has the button
@app.route('/data')
def data():
    return render_template('data.html')

#background process happening without any refreshing
@app.route('/display_data')
def display_data():
    print (f"Opening Stream", flush =  True)
    print("******************************************", flush =  True)
    print("******************************************", flush =  True)
    print("******************************************", flush =  True)

    open_stream()
    
    return ("nothing")



                    # SOCKETIO EVENT HANDLERS

@socketio.event
def my_event(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']})

@socketio.event
def display_data_request(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    message['data'] = f"{message['data']} (has been altered by server) + {jake_data}"
    emit('data_response',
         {'data': message['data'], 'count': session['receive_count']})

@socketio.event
def new_com_data(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('data_response',
         {'data': message, 'count': session['receive_count']})

@socketio.event
def disconnect_request():
    @copy_current_request_context
    def can_disconnect():
        disconnect()

    session['receive_count'] = session.get('receive_count', 0) + 1
    # for this emit we use a callback function
    # when the callback function is invoked we know that the message has been
    # received and it is safe to disconnect
    emit('my_response',
         {'data': 'Disconnected!', 'count': session['receive_count']},
         callback=can_disconnect)

@socketio.event
def connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)
    emit('my_reponse', {'data': 'Connected', 'count': 0})


@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected', request.sid)



##############################################################################
# Turn off all caching in Flask
#   (useful for dev; in production, this kind of stuff is typically
#   handled elsewhere)
#
# https://stackoverflow.com/questions/34066804/disabling-caching-in-flask

@app.after_request
def add_header(req):
    """Add non-caching headers on every request."""

    req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    req.headers["Pragma"] = "no-cache"
    req.headers["Expires"] = "0"
    req.headers['Cache-Control'] = 'public, max-age=0'
    return req


if __name__ == '__main__':
    socketio.run(app)

