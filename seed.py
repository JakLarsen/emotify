from models import User, Song, Userplaylist, Playlist, Playlistsong
from app import db

db.drop_all()
db.create_all()

u1 = User(username="Jake", password="asdasd", email = "jake@com.com")
u2 = User(username="Mike", password="asdasd", email = "mike@com.com")

s1 = Song(title="Welcome to the Jungle", artist="Guns N' Roses", album="Appetite for Destruction", duration=271, img='https://images-na.ssl-images-amazon.com/images/I/51K7n%2Bp70OL.jpg', file="welcometothejungle.mp3")
s3 = Song(title="Point of Know Return", artist="Kansas", album="Point of Know Return", duration=192, img='https://images-na.ssl-images-amazon.com/images/I/81DV-IyzlVL._SL1500_.jpg', file="pointofknowreturn.mp3")
s4 = Song(title="Sweet Child O' Mine", artist="Guns N' Roses", album="Appetite for Destruction", duration=355, img='https://images-na.ssl-images-amazon.com/images/I/51K7n%2Bp70OL.jpg', file="sweetchildomine.mp3")
s2 = Song(title="Thunderstruck", artist="ACDC", album="The Razors Edge", duration=292, img='https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/64fc25fd-d5ce-4b3a-93ab-4ef514a96251/d6yb5kr-fc7af1d6-d77a-4aa7-a47c-384761f5748f.jpg/v1/fill/w_1024,h_1024,q_75,strp/ac_dc_thunderstruck_album_reimagined_by_jerle73_d6yb5kr-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAyNCIsInBhdGgiOiJcL2ZcLzY0ZmMyNWZkLWQ1Y2UtNGIzYS05M2FiLTRlZjUxNGE5NjI1MVwvZDZ5YjVrci1mYzdhZjFkNi1kNzdhLTRhYTctYTQ3Yy0zODQ3NjFmNTc0OGYuanBnIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.zLo2YeZv6ruyRKPvDRkebrP1kn3uOpkw1pG86fYth18', file="thunderstruck.mp3")
s5 = Song(title="Nuvole Bianche", artist="Ludovico Einaudi", album="Una Mattina", duration=358, img='https://img.sheetmusic.direct/catalogue/product/ludovico-einaudi-una-mattina-lg.jpg', file="nuvolebianche.mp3")
s6 = Song(title="Divinire", artist="Ludovico Einaudi", album="Divinire", duration=406, img='https://lastfm.freetls.fastly.net/i/u/ar0/5a7e1bd2d3fe627607286802c5abef28.jpg', file="divinire.mp3")
s7 = Song(title="Comptine d'un autre ete...", artist="Yann Tiersen", album="Amelie", duration=179, img='https://images-na.ssl-images-amazon.com/images/I/71XiQQ8kmpL._AC_UL600_SR600,600_.jpg', file="comptine.mp3")
s8 = Song(title="American Pie", artist="Don McLean", album="American Pie", duration=517, img='https://upload.wikimedia.org/wikipedia/en/thumb/c/c0/Don_McLean_-_American_Pie_%28album%29_Coverart.png/220px-Don_McLean_-_American_Pie_%28album%29_Coverart.png', file="americanpie.mp3")
s9 = Song(title="Paradise City", artist="Guns N' Roses", album="Appetite for Destruction", duration=406, img='https://upload.wikimedia.org/wikipedia/en/thumb/2/2c/Paradisecity.jpg/220px-Paradisecity.jpg', file="paradisecity.mp3")
s10 = Song(title="Don't Stop Believing", artist="Journey", album="Escape", duration=251, img='https://m.media-amazon.com/images/I/71878xWTohL._SS500_.jpg', file="dontstopbelieving.mp3")
s11 = Song(title="Northern Soul", artist="Above & Beyond", album="Common Ground", duration=335, img='https://upload.wikimedia.org/wikipedia/en/2/2a/Common_Ground.jpg', file="northernsoul.mp3")
s12 = Song(title="Sun & Moon", artist="Above & Beyond", album="Original Mix", duration=326, img='https://upload.wikimedia.org/wikipedia/en/2/2a/Common_Ground.jpg', file="sunandmoon.mp3")
s13 = Song(title="Naked", artist="Above & Beyond", album="Common Ground", duration=323, img='https://upload.wikimedia.org/wikipedia/en/2/2a/Common_Ground.jpg', file="naked.mp3")
s14 = Song(title="Happiness Amplified", artist="Above & Beyond", album="Common Ground", duration=323, img='https://upload.wikimedia.org/wikipedia/en/2/2a/Common_Ground.jpg', file="happinessamplified.mp3")
s15 = Song(title="The Anthem", artist="Good Charlotte", album="The Young and the Hopeless", duration=175, img='https://upload.wikimedia.org/wikipedia/en/thumb/8/82/The_Young_and_the_Hopeless.jpg/220px-The_Young_and_the_Hopeless.jpg', file="theanthem.mp3")
s16 = Song(title="All The Small Things", artist="blink-182", album="Enema of the State", duration=167, img='https://upload.wikimedia.org/wikipedia/en/a/a6/Blink-182_-_Enema_of_the_State_cover.jpg', file="allthesmallthings.mp3")
s17 = Song(title="Still Waiting", artist="Sum 41", album="Does This Look Infected To You", duration=159, img='https://lastfm.freetls.fastly.net/i/u/770x0/842351bcf6f9421e3c56f06be0a82ee2.jpg', file="stillwaiting.mp3")
s18 = Song(title="The Middle", artist="Jimmy Eat World", album="Bleed American", duration=168, img='https://img.discogs.com/jAOGLTlNixV_aBoTaIGz6nikYtM=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-3508702-1369254248-8688.jpeg.jpg', file="themiddle.mp3")

p1 = Playlist(title="Library", description="All of your top hits. Updated daily.", img="https://d.newsweek.com/en/full/565399/u2.jpg?w=1600&h=1600&q=88&f=795924d4392e3e7eb568a50ccecda66a")
p2 = Playlist(title="Playlist 1", description="This is Playlist 1", img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg')
p3 = Playlist(title="Playlist 2", description="This is Playlist 2", img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg')
p4 = Playlist(title="Playlist 3", description="This is Playlist 3", img='https://i1.sndcdn.com/artworks-000084871237-w4wqxv-t500x500.jpg')

db.session.add_all([
    u1, u2, 
    s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18,
    p1, p2, p3, p4
])
db.session.commit()

up1 = Userplaylist(user_id=1, playlist_id=1)
up2 = Userplaylist(user_id=1, playlist_id=2)
up3 = Userplaylist(user_id=2, playlist_id=1)
up4 = Userplaylist(user_id=2, playlist_id=3)
up5 = Userplaylist(user_id=2, playlist_id=2)
up6 = Userplaylist(user_id=2, playlist_id=4)

# Seeding library with all songs
ps1 = Playlistsong(playlist_id=1, song_id=1)
ps2 = Playlistsong(playlist_id=1, song_id=2)
ps3 = Playlistsong(playlist_id=1, song_id=3)
ps4 = Playlistsong(playlist_id=1, song_id=4)
ps5 = Playlistsong(playlist_id=1, song_id=5)
ps6 = Playlistsong(playlist_id=1, song_id=6)
ps7 = Playlistsong(playlist_id=1, song_id=7)
ps8 = Playlistsong(playlist_id=1, song_id=8)
ps9 = Playlistsong(playlist_id=1, song_id=9)
ps10 = Playlistsong(playlist_id=1, song_id=10)
ps11 = Playlistsong(playlist_id=1, song_id=11)
ps12 = Playlistsong(playlist_id=1, song_id=12)
ps13 = Playlistsong(playlist_id=1, song_id=13)
ps14 = Playlistsong(playlist_id=1, song_id=14)
ps15 = Playlistsong(playlist_id=1, song_id=15)
ps16 = Playlistsong(playlist_id=1, song_id=16)
ps17 = Playlistsong(playlist_id=1, song_id=17)
ps18 = Playlistsong(playlist_id=1, song_id=18)

#A random playlist
ps19 = Playlistsong(playlist_id=2, song_id=1)
ps20 = Playlistsong(playlist_id=2, song_id=2)
ps21 = Playlistsong(playlist_id=2, song_id=4)

db.session.add_all([
    up1, up2, up3, up4, up5, up6, 
    ps1, ps2, ps3, ps4, ps5, ps6, ps7, ps8, ps9, ps10, ps11, ps12, ps13, ps14, ps15, ps16, ps17, ps18, ps19, ps20, ps21
])
db.session.commit()