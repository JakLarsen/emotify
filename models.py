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

class Usersong(db.Model):
    """Connection of users <--> songs"""
    __tablename__ = 'usersongs'

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="cascade"),
        primary_key = True,
    )
    song_id = db.Column(
        db.Integer,
        db.ForeignKey('songs.id', ondelete="cascade"),
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

    usersongs = db.relationship(
        "User",
        secondary="usersongs",
        primaryjoin=(Usersong.user_id == id),
        secondaryjoin=(Usersong.song_id == id)
    )


    






def connect_db(app):
    """Connect this database to provided Flask app"""

    db.app = app
    db.init_app(app)

