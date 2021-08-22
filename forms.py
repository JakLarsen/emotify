from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField
from wtforms import validators
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
