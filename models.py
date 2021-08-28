"""SQLAlchemy models for Emotify."""

from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()


class Song(db.Model):
    """User in the system."""
    __tablename__ = 'songs'

    id = db.Column(
        db.Integer,
        primary_key=True,
        )
    title = db.Column(
        db.Text,
        nullable = False,
        unique=True,
    )
    artist = db.Column(
        db.Text,
        nullable = False,
    )
    album =  db.Column(
        db.Text,
        nullable = False,
    )
    duration = db.Column(
        db.Integer,
        nullable = False,
    )
    img = db.Column(
        db.Text,
        nullable = False,
    )
    file= db.Column(
        db.Text,
        nullable = False,
    )

class Playlist(db.Model):
    """A user's Playlist"""
    __tablename__= 'playlists'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )
    title = db.Column(
        db.Text,
        nullable = False,
    )
    description = db.Column(
        db.Text,
        nullable = False,
    )
    img = db.Column(
        db.Text,
        nullable = True,
        default = 'img.url',
    )

class Userplaylist(db.Model):
    """Connection of users <--> playlists"""
    __tablename__ = 'userplaylists'

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="cascade"),
        primary_key = True,
    )
    playlist_id = db.Column(
        db.Integer,
        db.ForeignKey('playlists.id', ondelete="cascade"),
        primary_key = True,
    )

class User(db.Model):
    """User in the system."""
    __tablename__ = 'users'

    id = db.Column(
        db.Integer,
        primary_key=True,
        )
    username = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )
    password = db.Column(
        db.Text,
        nullable=False,
    )
    email = db.Column(
        db.Text,
        nullable = True,
        unique = True,
    )

    @classmethod
    def signup(cls, username, password):
        """
        Sign a User up
        Hashes password and adds User to database: Emotify
        """
        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')
        user = User(
            username=username,
            password=hashed_pwd,
        )
        db.session.add(user)
        db.session.commit()
        return user

    @classmethod
    def authenticate(cls, username, password):
        """
        Find User with given username
        Checks password against a given salted and hashed password value
        Returns the User if correct and found, otherwise False
        """
        user = cls.query.filter_by(username=username).first()
        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user
        return False

    userplaylists = db.relationship(
        "User",
        secondary="userplaylists",
        primaryjoin=(Userplaylist.user_id == id),
        secondaryjoin=(Userplaylist.playlist_id == id)
    )


    






def connect_db(app):
    """Connect this database to provided Flask app"""

    db.app = app
    db.init_app(app)

