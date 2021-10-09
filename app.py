                    


#----------------------------------------------------------------------                    
                    # IMPORTS
#----------------------------------------------------------------------



import os
import re
# # from flask_debugtoolbar import DebugToolbarExtension
from threading import Lock
from flask import Flask, render_template, flash, request, redirect, session, g, \
    copy_current_request_context, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
import websocket
from sqlalchemy.exc import IntegrityError
from models import db, connect_db, User, Song, Userplaylist, Playlist, Usersong, Playlistsong
from forms import LoginForm, UserAddForm, AddSongForm, AddPlaylistForm
from random import randint
from cortex import Cortex, jake_data
from copy import copy
import pdb



#----------------------------------------------------------------------
                    # FLASK APP CONFIG
#----------------------------------------------------------------------



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



#----------------------------------------------------------------------
                    # GLOBALS
#----------------------------------------------------------------------



#GLOBAL USER
CURR_USER_KEY = "curr_user"

#USER OBJECT FOR AUTHENTICATING HEADSET WITH EMOTIV'S CORTEX API
jake_user = {
    'client_id': 'hVe4d7WF19ObiuGfJKL8yYo7aivjP692nWHiRzJw',
    'client_secret': 'rjtEBdSANn6JGE6LsgrrgZdA9dKlItdF1d4w1inJx5iyGI3MjZD6Wus5BnLoaa3koMhIH1eOJ8U75VIUaW7DsKIicy4YyRDpJFP1Nhcs6MgWx6HcpYyideIIWSiUKApz',
    "headset_id": "INSIGHT-A2D203D1",
    "license": "", #don't generally need to specify license - cortext should find it based on client_id
    "debit": 100
}
profile_name = 'Jake Main'



#----------------------------------------------------------------------
                    # HEADSET DATA PROCESSING 
#----------------------------------------------------------------------



#Settings for mental action input threshold, interval of data display processing/display, etc

#interval 2s, 20 items(if timestamp incl.) is about 10 inputs over 1s
#40 inputs over 2s has overlap about .5s and 2.5s spread of data ->interval needs to be higher to process
#30 inputs over 2s with NO timestamp is stable with no overlap.
settings = {
    'input_threshold': 13,
    'interval': 2,
    'items': 30
}

def determine_input(data_obj):
    """
    Takes a DataContainer(containing headset stream data) as input (in cortex.py)
    -Determines if a given input surpassed a threshold to be used as a command
    -Returns "push", "pull", or "neutral" pending what is stored in DataContainer
    """
    push_input = 0
    pull_input = 0
    for i in range(len(data_obj.data)):
        if data_obj.data[i] == "push":
            push_input += 1
        if data_obj.data[i] == "pull":
            pull_input += 1
    print(push_input, pull_input, flush = True)
    if push_input >= settings['input_threshold']:
        return "push"
    elif pull_input >= settings['input_threshold']:
        return "pull"
    else:
        return "neutral"
    """Can comment out code above and just return any of the values for testing purposes"""
    # return "pull"
    # return "neutral"
    # return "push"

def restrict_data(data_obj):
    """
    Reinstantiates our DataContainer with fewer entries
    -Keeps it from bloating
    -Lets us use only most recent inputs
    Returns the reduced DataContainer instance as data_obj
    """
    #Takes a snapshot of the data coming in
    data_obj_copy = copy(data_obj)
    if len(data_obj_copy.data) > 5:
        #We restrict data being processed to last 20 at the time the data copy is made
        data_obj_copy.data = data_obj_copy.data[-(settings['items']):-1]
        #Recopy to prevent bloat
        data_obj = copy(data_obj_copy)
    return data_obj_copy



#----------------------------------------------------------------------
                    # SERVER THREADING
#----------------------------------------------------------------------
            


def background_thread():
    """Emit server generated events to client at 'data_response'"""
    count = 0
    while True:
        data_to_display = restrict_data(jake_data)
        our_input = determine_input(data_to_display)
        socketio.sleep(settings['interval'])
        count += 1
        socketio.emit('data_response', 
            {'data': json.dumps(data_to_display.data), 'count': count, 'input': our_input})



#----------------------------------------------------------------------
                    # CORTEX CONNECTIon
#----------------------------------------------------------------------



def open_stream():
    """
    Connects a turned on Emotiv headset to Cortex API
    -Does Auth and requests
    -Loads Profile
    -Opens mental command subscription
    """
    # # Init Cortex Instance
    jake = Cortex(jake_user)
    # do preparation/auth steps in Cortex.py
    jake.do_prepare_steps()
    # load existed profile
    profiles = jake.query_profile()
    if profile_name in profiles:
        status = 'load'
        jake.setup_profile(profile_name, status)
    else:
        print(f"Profile {profile_name} does not exist.")
    jake.get_mental_command_active_action(profile_name)
    jake.get_mental_command_action_sensitivity(profile_name)
    #set values for mental command action sensitivity
    values = [7,7,5,5]
    jake.set_mental_command_action_sensitivity(profile_name, values)
    # live mental command data
    jake.sub_request(stream=['com'])



#----------------------------------------------------------------------
                    # APP VIEW FUNCTIONS
#----------------------------------------------------------------------



def addLibrary():
    """
    Gives all users the library playlist
    -Auth for removing songs is handled elsewhere
    """
    library = Playlist.query.get(1)
    g.user.userplaylists.append(library)
    db.session.commit()



                    # USER LOGIN HANDLERS



@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""
    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])
        addLibrary()
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
def app_home():
    """Display home if logged in or home-anon if user not in session"""
    if g.user:
        my_playlists = g.user.userplaylists
        songs = Song.query.all()
        return render_template('app.html', async_mode=socketio.async_mode, songs=songs, my_playlists=my_playlists)
    else:
        return render_template('landing.html')

@app.route('/signup', methods=["GET", "POST"])
def signup():
    """
    Handle user signup.
    -Create new user and add to DB. Redirect to home page.
    -If form not valid, present form.
    -If the there already is a user with that username: flash message and re-present form.
    """
    if g.user:
        return render_template('app.html', async_mode=socketio.async_mode)
    else:
        form = UserAddForm()
        if form.validate_on_submit():
            try:
                user = User.signup(
                    username=form.username.data,
                    password=form.password.data,
                )
                db.session.commit()
            except IntegrityError:
                return render_template('users/signup.html', form=form)
            do_login(user)
            return redirect("/")
        else:
            return render_template('users/signup.html', form=form)

@app.route('/login', methods=["GET", "POST"])
def login():
    """Handle user login."""

    if g.user:
        return render_template('app.html', async_mode=socketio.async_mode)
    else:
        form = LoginForm()
        if form.validate_on_submit():
            user = User.authenticate(form.username.data, form.password.data)
            if user:
                do_login(user)
                return redirect("/")
        return render_template('users/login.html', form=form)

@app.route('/logout')
def logout():
    """Handle logout of user."""
    do_logout()  
    return redirect('/')

@app.route('/home')
def show_home():
    """Home Content"""

    if not g.user:
        flash("Access unauthorized.")
        return redirect('/')

    songs = Song.query.all()
    my_playlists=g.user.userplaylists

    return render_template('/users/home.html', songs=songs, my_playlists=my_playlists)

@app.route('/your-playlists')
def show_playlists():
    """Your Playlists Page Content"""

    if not g.user:
        flash("Access unauthorized.")
        return redirect('/')

    songs = Song.query.all()
    my_playlists=g.user.userplaylists

    return render_template('/users/your-playlists.html', songs=songs, my_playlists=my_playlists)

@app.route('/data')
def data():
    """Display a page dedicated to showing data from headset inputs - for dev"""
    if g.user:
        return render_template('data.html')
    else:
        return redirect('/')

@app.route('/display_data')
def display_data():
    """Opens subscription stream to Emotiv Headset"""
    if g.user:
        print (f"Opening Stream", flush =  True)
        print("******************************************", flush =  True)
        print("******************************************", flush =  True)
        print("******************************************", flush =  True)
        open_stream()
        return ("nothing")
    else:
        return redirect('/')

@app.route('/add-song', methods=["GET", "POST"])
def add_song():
    """Add song to library"""

    if not g.user:
        flash("Access unauthorized.")
        return redirect("/")

    my_playlists = g.user.userplaylists

    form = AddSongForm()
    if form.validate_on_submit():

        try:
            title = form.title.data
            artist = form.artist.data
            album = form.album.data
            img = form.img.data
            file= form.file.data
            duration = form.duration.data
            user_id = g.user.id

            new_song = Song(title=title, artist=artist, album=album, img=img, file=file, duration=duration, user_id=user_id)
            db.session.add(new_song)
            db.session.commit()

            #Add new song to Library
            new_playlistsong = Playlistsong(playlist_id=1, song_id = new_song.id)
            db.session.add(new_playlistsong)
            db.session.commit()

        except:
            flash("Song already in library, or something went wrong")
            return render_template('users/add-song.html', form=form, my_playlists=my_playlists)

        return redirect('/')

    else:
        return render_template('users/add-song.html', form=form, my_playlists=my_playlists)

@app.route('/song-data/<int:song_id>')
def retrieve_song_data(song_id):

    if not g.user:
        flash("Access unauthorized.")
        return redirect('/')

    song = Song.query.get(song_id)
    songs = len(Song.query.all())
    id = song.id
    title = song.title
    artist = song.artist
    img = song.img
    duration = song.duration
    file = song.file
    total_songs = songs


    return jsonify({
        'id':id,
        'title':title,
        'artist':artist,
        'img':img,
        'file':file,
        'duration':duration,
        'total_songs': total_songs
    })   
    
@app.route('/song/<int:id>/delete', methods=["POST"])
def delete_song(id):
    """Delete a Song that a User has created"""

    print("hit delete endpoint", flush=True)
    if not g.user:
        flash("Access unauthorized.")
        return redirect('/')
    
    songToDelete = Song.query.get(id)
    
    db.session.delete(songToDelete)
    db.session.commit()

    return redirect("/")

@app.route('/create-playlist', methods=["GET","POST"])
def create_playlist():
    """Create a Playlist and associate it with a User"""

    if not g.user:
        flash("Access unauthorized.")
        return redirect('/')
    
    my_playlists=g.user.userplaylists
    
    form = AddPlaylistForm()
    if form.validate_on_submit():
        try:
            title = form.title.data
            description = form.description.data
            img = form.img.data

            new_playlist = Playlist(title=title, description=description, img=img)
            g.user.userplaylists.append(new_playlist)
            db.session.add(new_playlist)
            db.session.commit()

        #this except isn't working
        except:
            return render_template('users/create-playlist.html', form=form, my_playlists=my_playlists)

        return redirect('/')

    else:
        return render_template('users/create-playlist.html', form=form, my_playlists=my_playlists)

@app.route('/playlist/<int:id>')
def show_playlist(id):
    """Show individual playlist"""

    if not g.user:
        flash("Access unauthorized.")
        return redirect('/')

    playlist = Playlist.query.get_or_404(id)
    songsOfPlaylist = playlist.playlistsongs
    my_playlists = g.user.userplaylists

    print(my_playlists, flush=True)

    return render_template('users/playlist.html', playlist=playlist, songs = songsOfPlaylist, my_playlists=my_playlists)

def validate_user_playlist(playlistLi, id):
    """Validates that the playlist is one of the User's"""

    for playlist in playlistLi:
        if id == playlist.id:
            return True
    return False

@app.route('/playlist/<int:id>/delete', methods=["GET","POST"])
def delete_playlist(id):
    """Delete a Playlist that a User has created"""

    print("hit delete endpoint", flush=True)
    if not g.user:
        flash("Access unauthorized.")
        return redirect('/')
    if id == 1:
        flash("Access unauthorized.")
        return redirect('/')
    
    user_playlists = g.user.userplaylists
    playlist = Playlist.query.get_or_404(id)

    if validate_user_playlist(user_playlists, id):
        db.session.delete(playlist)
        db.session.commit()

    return redirect("/")

@app.route('/playlist/<int:playlist_id>/remove/<int:song_id>')
def remove_song_from_playlist(playlist_id, song_id):
    """Remove a song from one of YOUR Userplaylists"""

    if not g.user:
        return redirect('/')

    myPlaylists = g.user.userplaylists
    playlistToRemoveFrom = Playlist.query.get_or_404(playlist_id)
    songToRemove = Song.query.get_or_404(song_id)

    if playlistToRemoveFrom not in myPlaylists:
        return redirect('/')
    else:
        playlistToRemoveFrom.playlistsongs.remove(songToRemove)
        db.session.commit()

    return redirect(f'/playlist/{playlistToRemoveFrom.id}')

@app.route('/playlist-data/<int:playlist_id>')
def retrieve_playlist_data(playlist_id):
    if not g.user:
        flash("Access unauthorized.")
        return redirect('/')

    playlist = Playlist.query.get(playlist_id)
    length = len(playlist.playlistsongs)

    id=playlist.id
    title=playlist.title
    description=playlist.description
    img = playlist.img

    return jsonify({
        'id':id,
        'title':title,
        'description':description,
        'img':img,
        'length':length
    })

@app.route('/playlist/<int:playlist_id>/add-song/<int:song_id>')
def add_song_to_playlist(playlist_id, song_id):
    """Adds a song to a playlist"""

    if not g.user:
        return redirect('/')

    playlist = Playlist.query.get_or_404(playlist_id)
    songToAdd = Song.query.get_or_404(song_id)
    playlist.playlistsongs.append(songToAdd)

    db.session.commit()

    return redirect(f'/playlist/{playlist.id}')



def on_message(ws, message):
        print(message)



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
    and emits to 'data_response' with altered data from headset
    """
    session['receive_count'] = session.get('receive_count', 0) + 1
    message['data'] = f"{message['data']} (has been altered by server) + {jake_data.data}"
    emit('data_response',
         {'data': message['data'], 'count': session['receive_count']})

@socketio.event
def disconnect_request():
    """On disconnect button submit, disconnect"""
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
    """Instantiate a thread for server generated events when connected"""
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
    """Add non-caching headers on every request"""
    req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    req.headers["Pragma"] = "no-cache"
    req.headers["Expires"] = "0"
    req.headers['Cache-Control'] = 'public, max-age=0'
    return req


#Disable for ipython testing
# if __name__ == '__main__':
#     socketio.run(app)

