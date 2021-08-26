from models import User, Song, Usersong
from app import db

db.drop_all()
db.create_all()

u1 = User(username="Jake", password="123", email = "jake@com.com")
u2 = User(username="Mike", password="1234", email = "mike@com.com")
u3 = User(username="Abby", password="1234", email = "abby@com.com")
u4 = User(username="Mikee", password="1234", email = "mikee@com.com")
u5 = User(username="Mikeee", password="1234", email = "mikeee@com.com")

s1 = Song(title="Test Song 1", artist="Artist 1", duration=220, img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg', file="thunderstruck.mp3")
s2 = Song(title="Test Song 2", artist="Artist 2", duration=320, img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg', file="thunderstruck.mp3")
s3 = Song(title="Test Song 3", artist="Artist 3", duration=350, img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg', file="thunderstruck.mp3")

us1 = Usersong(user_id=1, song_id=1)
us2 = Usersong(user_id=1, song_id=2)
us3 = Usersong(user_id=2, song_id=1)
us4 = Usersong(user_id=2, song_id=3)

db.session.add_all([u1, u2, u3, u4, u5, s1, s2, s3, us1, us2, us3, us4])
db.session.commit()