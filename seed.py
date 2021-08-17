from models import User
from app import db

db.drop_all()
db.create_all()

u1 = User(username="Jake", password="123")

db.session.add(u1)
db.session.commit()