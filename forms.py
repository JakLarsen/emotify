from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField
from wtforms import validators
from wtforms.fields.core import IntegerField
from wtforms.validators import DataRequired, Length #need to add email validator

class UserAddForm(FlaskForm):
    """ Form for adding a new User"""

    username = StringField('Username', validators=[DataRequired()], render_kw={"placeholder": "Enter a username."})
    email = StringField("What's your e-mail", validators=[DataRequired()], render_kw={"placeholder": "Enter your email."})
    password = PasswordField('Create a password', validators=[DataRequired(), Length(min=6)], render_kw={"placeholder": "Create a password."})

class LoginForm(FlaskForm):
    """Form for logging in an existing User"""

    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])

class AddSongForm(FlaskForm):
    """Form for adding a new song"""

    title = StringField('What is the song title', validators=[DataRequired()])
    artist = StringField('Who is it by', validators=[DataRequired()])
    album = StringField ('Which album is it in', validators=[DataRequired()])
    img = StringField('Add a link to the album cover', validators=[DataRequired()])
    file = StringField('What is the name of the audio file', validators=[DataRequired()])
    duration =  IntegerField('How long is it in seconds', validators=[DataRequired()])

class AddPlaylistForm(FlaskForm):
    """Form for adding a new playlist"""

    title = StringField('What would you like to call it', validators=[DataRequired()])
    description = StringField('Tell me a bit about it', validators=[DataRequired()])
    img = StringField('Add an image link to display with it', validators=[])


