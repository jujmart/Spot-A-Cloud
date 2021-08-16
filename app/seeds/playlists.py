from app.models import db, Playlist
from .songs import demo as song_demo1


def seed_playlists():
    demo = Playlist(
        userId=1 , title='title goes here', description='Description')

    db.session.add(demo)
    demo.songs.append(song_demo1)
    db.session.commit()




# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_playlists():
    db.session.execute('TRUNCATE playlists RESTART IDENTITY CASCADE;')
    db.session.commit()
