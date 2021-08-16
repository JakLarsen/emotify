"""SQLAlchemy models for Emotify."""

from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()

class User(db.Model):
    """Users in system"""

    __tablename__ = "users"

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















def connect_db(app):
    """Connect this database to provided Flask app."""

    db.app = app
    db.init_app(app)

