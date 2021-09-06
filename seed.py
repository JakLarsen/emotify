from models import User, Song, Userplaylist, Playlist
from app import db

db.drop_all()
db.create_all()

u1 = User(username="Jake", password="asdasd", email = "jake@com.com")
u2 = User(username="Mike", password="asdasd", email = "mike@com.com")
u3 = User(username="Abby", password="asdasd", email = "abby@com.com")
u4 = User(username="Mikee", password="asdasd", email = "mikee@com.com")
u5 = User(username="Mikeee", password="asdasd", email = "mikeee@com.com")

s1 = Song(title="Welcome to the Jungle", artist="Guns N' Roses", album="Appetite for Destruction", duration=271, img='https://images-na.ssl-images-amazon.com/images/I/51K7n%2Bp70OL.jpg', file="welcometothejungle.mp3")
s3 = Song(title="Point of Know Return", artist="Kansas", album="Point of Know Return", duration=192, img='https://images-na.ssl-images-amazon.com/images/I/81DV-IyzlVL._SL1500_.jpg', file="pointofknowreturn.mp3")
s4 = Song(title="Sweet Child O' Mine", artist="Guns N' Roses", album="Appetite for Destruction", duration=355, img='https://images-na.ssl-images-amazon.com/images/I/51K7n%2Bp70OL.jpg', file="sweetchildomine.mp3")
s2 = Song(title="Thunderstruck", artist="ACDC", album="The Razors Edge", duration=292, img='https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/64fc25fd-d5ce-4b3a-93ab-4ef514a96251/d6yb5kr-fc7af1d6-d77a-4aa7-a47c-384761f5748f.jpg/v1/fill/w_1024,h_1024,q_75,strp/ac_dc_thunderstruck_album_reimagined_by_jerle73_d6yb5kr-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAyNCIsInBhdGgiOiJcL2ZcLzY0ZmMyNWZkLWQ1Y2UtNGIzYS05M2FiLTRlZjUxNGE5NjI1MVwvZDZ5YjVrci1mYzdhZjFkNi1kNzdhLTRhYTctYTQ3Yy0zODQ3NjFmNTc0OGYuanBnIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.zLo2YeZv6ruyRKPvDRkebrP1kn3uOpkw1pG86fYth18', file="thunderstruck.mp3")
s5 = Song(title="Crazy Train", artist="Ozzy Osbourne", album="Blizzard of Ozz", duration=292, img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg', file="crazytrain.mp3")

p1 = Playlist(title="Playlist 1", description="This is Playlist 1", img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg')
p2 = Playlist(title="Playlist 2", description="This is Playlist 2", img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg')
p3 = Playlist(title="Playlist 3", description="This is Playlist 3", img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg')

db.session.add_all([u1, u2, u3, u4, u5, s1, s2, s3,s4,s5, p1, p2, p3])
db.session.commit()

up1 = Userplaylist(user_id=1, playlist_id=1)
up2 = Userplaylist(user_id=1, playlist_id=2)
up3 = Userplaylist(user_id=2, playlist_id=1)
up4 = Userplaylist(user_id=2, playlist_id=3)

db.session.add_all([up1, up2, up3, up4])
db.session.commit()