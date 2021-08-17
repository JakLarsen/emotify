import os
from flask import Flask, render_template, request, flash, redirect, session, g
# from flask_debugtoolbar import DebugToolbarExtension
# from forms import 
from models import db, connect_db, User 
import pdb



                    # GLOBALS

CURR_USER_KEY = "curr_user"



                    #FLASK APP CONFIG
 
app = Flask(__name__)

# Get DB_URI from environ variable (useful for production/testing) or,
# if not set there, use development local db.
app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgresql:///emotify'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = True
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")
# toolbar = DebugToolbarExtension(app)

connect_db(app)



#----------------------------------------------------------------------
                    # APP VIEW FUNCTIONS
#----------------------------------------------------------------------



                    #Handle User Logins

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
def home():
    """Display home if logged in or home-anon if user not in session"""

    if g.user:
        return render_template('home.html')
    else:
        return render_template('home-anon.html')