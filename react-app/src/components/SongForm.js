import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { getAllGenresThunk } from "../store/genre";
import { uploadSongThunk } from "../store/songs";

const SongForm = () => {
	const [errors, setErrors] = useState([]);
	const [songUrl, setSongUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [albumImage, setAlbumImage] = useState("");
  const [genres, setGenres] = useState(new Set());
  const user = useSelector((state) => state.session.user);
  const genresList = useSelector((state) => state.genres);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllGenresThunk());
  }, [dispatch]);

  const handleOptionClick = (e) => {
    setGenres((prevGenres) => prevGenres.add(+e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let songData = new FormData();
    songData.set("file", songUrl);
    songData.set("image", albumImage);

    const data = {
      title,
      artist,
      album,
      genres: [...genres],
    };

    await dispatch(uploadSongThunk(data, songData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {errors.map((error, ind) => (
          <div key={ind}>{error}</div>
        ))}
      </div>
      <div>
        <img src={albumImage ? URL.createObjectURL(albumImage) : ""} />
        <label htmlFor="songUrl">Audio File</label>
        <input
          type="file"
          accept=".m4a,.flac,.mp3,.mp4,.wav,.wma,.aac"
          name="songUrl"
          onChange={(e) => {
            setSongUrl(e.target.files[0]);
          }}
        />
      </div>
      <div>
        <label htmlFor="title">Title</label>
        <input
          name="title"
          type="text"
          placeholder="title"
          value={title}
          required
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="artist">Artist</label>
        <input
          name="artist"
          type="text"
          placeholder="artist"
          value={artist}
          onChange={(e) => {
            setArtist(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="album">Album</label>
        <input
          name="album"
          type="text"
          placeholder="album"
          value={album}
          onChange={(e) => {
            setAlbum(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="albumImage">AlbumImage</label>
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.gif"
          name="albumImage"
          onChange={(e) => {
            setAlbumImage(e.target.files[0]);
          }}
        />
      </div>
      <div>
        <label htmlFor="genres">Genres</label>
        <select
          name="genres"
          onChange={(e) => handleOptionClick(e)}
          defaultValue="Select Genre"
        >
          <option disabled>Select Genre</option>
          {genresList.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.genreName}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SongForm;
