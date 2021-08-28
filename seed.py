from models import User, Song, Userplaylist, Playlist
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

p1 = Playlist(title="Playlist 1", description="This is Playlist 1", img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg')
p2 = Playlist(title="Playlist 2", description="This is Playlist 2", img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg')
p3 = Playlist(title="Playlist 3", description="This is Playlist 3", img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg')

up1 = Userplaylist(user_id=1, playlist_id=1)
up2 = Userplaylist(user_id=1, playlist_id=2)
up3 = Userplaylist(user_id=2, playlist_id=1)
up4 = Userplaylist(user_id=2, playlist_id=3)

db.session.add_all([u1, u2, u3, u4, u5, s1, s2, s3, p1, p2, p3, up1, up2, up3, up4])
db.session.commit()