from app.forms.song_form import SongForm
from flask import Blueprint, jsonify, render_template, request
from sqlalchemy.sql.functions import char_length
# from flask_login import login_required
from app.models import Song, db
from sqlalchemy.orm import joinedload

songs_routes = Blueprint('songs', __name__)


@songs_routes.route('/')
def get_all_songs():
    songs = Song.query.options(joinedload(Song.genres)).all()
    song_list = []
    for song in songs:
        song_dict = song.to_dict()
        song_dict["genres"] = [genre.to_dict() for genre in song.genres]
        song_list.append(song_dict)

    return {'songs': song_list}


@songs_routes.route('/<int:id>')
def get_one_song(id):
    song = Song.query.options(joinedload(Song.genres)).get(id)
    song_dict = song.to_dict()
    song_dict["genres"] = [genre.to_dict() for genre in song.genres]
    return song_dict


@songs_routes.route('/', methods=["POST"])
def post_song():
    print("AAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHH", request.data)
    form = SongForm()
    if form.validate_on_submit():
        new_song = Song()
        form.populate_obj(new_song)
        db.session.add(new_song)
        db.session.commit()
        new_song_data = new_song.to_dict()
        # new_song_data["genres"] = [genre.to_dict()
        #                            for genre in new_song.genres]
        return new_song_data
    return form.errors


# @songs_routes.route("/test")
# def test_song():
#     form = SongForm()
#     return render_template("test.html", form=form)