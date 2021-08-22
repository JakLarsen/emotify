from models import User
from app import db

db.drop_all()
db.create_all()

u1 = User(username="Jake", password="123", email = "jake@com.com")
u2 = User(username="Mike", password="1234", email = "mike@com.com")

db.session.add_all([u1, u2])
db.session.commit()