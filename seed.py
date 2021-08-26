from models import User, Song
from app import db

db.drop_all()
db.create_all()

u1 = User(username="Jake", password="123", email = "jake@com.com")
u2 = User(username="Mike", password="1234", email = "mike@com.com")

s1 = Song(title="Test Song 1", artist="Artist 1", duration=220, img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg', file="thunderstruck.mp3")
s2 = Song(title="Test Song 2", artist="Artist 2", duration=320, img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg', file="thunderstruck.mp3")

db.session.add_all([u1, u2, s1, s2])
db.session.commit()