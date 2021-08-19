import os
# # from flask_debugtoolbar import DebugToolbarExtension
from threading import Lock
from flask import Flask, render_template, request, redirect, session, g, \
    copy_current_request_context
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from models import db, connect_db, User 
from random import randint
from cortex import Cortex, jake_data
import pdb



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

connect_db(app)





                    #-------------------------------------------------
                                        # NOTES
                    #-------------------------------------------------
#or do I need to set up a listener through websocket-client here that can listen for events happening on the cortex side?
#or do I need to convert cortex to use a socketio websocket? (or the client to use websocket-client instead?)
## - Do I need the same websocket library for both?

#In determine_input 
#-- List is being populated by 20 instead of 5 or 59/60 instead of 20.
#-- I believe this might be due to some sort of data race
#-- IT SEEMS like the function is reading the first 5 or 20 entries in the list, which means the functions are working
#-- Need to send the restricted data object instead of using the global when printing is the SOLUTION - SOLVED





                    # GLOBALS



#Global logged-in User
CURR_USER_KEY = "curr_user"

#User object in Cortex Class for auth.
jake_user = {
    'client_id': 'hVe4d7WF19ObiuGfJKL8yYo7aivjP692nWHiRzJw',
    'client_secret': 'rjtEBdSANn6JGE6LsgrrgZdA9dKlItdF1d4w1inJx5iyGI3MjZD6Wus5BnLoaa3koMhIH1eOJ8U75VIUaW7DsKIicy4YyRDpJFP1Nhcs6MgWx6HcpYyideIIWSiUKApz',
    "headset_id": "INSIGHT-A2D203D1",
    "license": "", #don't generally need to specify license - cortext should find it based on client_id
    "debit": 100
}
profile_name = 'Jake Main'

settings = {
    'input_threshold': 15
}
    
#Determine which input we are using - haven't tested in realtime yet
def determine_input(data_obj):
    """
    Takes a DataContainer data_obj (in cortex.py)

    Determines if there is a sequence of push or pull commands sent in succession
    -data from the DataContainer sent

    Returns "push", "pull", or "neutral" pending what is stored in DataContainer
    """

    push_input = 0
    pull_input = 0

    for i in range(len(data_obj.data)):
        if data_obj.data[i] == "push":
            push_input += 1
        if data_obj.data[i] == "pull":
            pull_input += 1
    print(push_input, pull_input, flush = True)
    if push_input >= 10:
        return "push"
    elif pull_input >= 10:
        return "pull"
    else:
        return "neutral"

    """Can comment out code above and just return any of the values for testing purposes"""
    # return "pull"
    # # return "neutral"
    # # return "push"

def restrict_data(data_obj):
    """
    Reinstantiates our DataContainer with fewer entries
    -Keeps it from bloating
    -Lets us use only most recent inputs

    Returns the reduced DataContainer instance as data_obj
    """

    if len(data_obj.data) > 5:
        #give just last input
        # data_obj.data = data_obj.data[-1]
        #last 5 inputs
        #it's printing last 20 with 5 overlapping??? interesting
        #last 20 inputs
        #Prints 60ish and reads first 20 of them it seems
        #We had a push then a swap to neutral with 11 neutrals followed by 18 pushes, so I'm pretty sure the function is reading from the top 20
        #It can't be reading from base because following command was neutral and had over the threshold pushes at the end
        data_obj.data = data_obj.data[-20:-1]
    else:
        pass
    return data_obj


                    # SERVER THREADING

def background_thread():
    """Emit server generated events to client at 'data_response'"""

    count = 0
    while True:

        restrict_data(jake_data)
        our_input = determine_input(jake_data)
        # print(jake_data.data, flush = True)
        socketio.sleep(5)
        count += 1
        socketio.emit('data_response', 
            {'data': json.dumps(jake_data.data), 'count': count, 'input': our_input})
#I need to set up a socket with Emotiv as well, which constantly emits the data like this thread instead of printing it.



#-----------------------------------------------------------------
                    #Cortex Connection
#-----------------------------------------------------------------



def open_stream():

    """
    Connects a turned on headset to Cortex API
    -Does Auth and requests
    -Loads Profile
    -Opens mental command subscription
    """

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

@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])
    else:
        g.user = None

def do_login(user):
    """Log in a User."""

    session[CURR_USER_KEY] = user.id

def do_logout():
    """Logout a User."""

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]



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
    """Display a page dedicated to showing data from headset inputs"""
    return render_template('data.html')

#background process happening without any refreshing
@app.route('/display_data')
def display_data():
    """Opens subscription stream to Emotiv Headset"""

    print (f"Opening Stream", flush =  True)
    print("******************************************", flush =  True)
    print("******************************************", flush =  True)
    print("******************************************", flush =  True)

    open_stream()
    
    return ("nothing")



                    # SOCKETIO EVENT HANDLERS

@socketio.event
def my_event(message):
    """
    Listens for clientside data on 'my_event',
    and emits to 'my_response'
    """

    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']})

@socketio.event
def display_data_request(message):
    """
    Listens for clientside data on 'display_data_request',
    shows that it can be altered by server, 
    and emits to 'data_response' with altered data from headset
    """

    session['receive_count'] = session.get('receive_count', 0) + 1
    message['data'] = f"{message['data']} (has been altered by server) + {jake_data.data}"
    emit('data_response',
         {'data': message['data'], 'count': session['receive_count']})

# @socketio.event #It wont be using socketio, but yeah
# def new_com_data(message):
# """Need a way to listen for emitted data from cortex file???"""
#     session['receive_count'] = session.get('receive_count', 0) + 1
#     emit('data_response',
#          {'data': message, 'count': session['receive_count']})

@socketio.event
def disconnect_request():
    """
    On disconnect button submit, disconnect
    """

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
    """
    Instantiate a thread for server generated events when connected
    """

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
    """
    Add non-caching headers on every request
    """

    req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    req.headers["Pragma"] = "no-cache"
    req.headers["Expires"] = "0"
    req.headers['Cache-Control'] = 'public, max-age=0'
    return req


if __name__ == '__main__':
    socketio.run(app)

