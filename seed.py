from models import User
from app import db

db.drop_all()
db.create_all()

u1 = User(username="Jake", password="123")
u2 = User(username="Mike", password="1234")

db.session.add_all([u1, u2])
db.session.commit()