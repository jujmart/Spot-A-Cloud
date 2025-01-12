import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
	deletePlaylistThunk,
	populatePlaylistFromArrThunk,
} from "../store/playlist";
import { getASingleUserThunk, unfollowThunk } from "../store/session";
import { deleteSongThunk, setPlaylistSongsThunk } from "../store/songs";
import { deleteUserPlaylist, deleteUserSong } from "../store/userMusicInfo";
import { addFollowThunk } from "../store/session";
import "./css/user-profile-page.css";
import PlaylistCard from "./PlaylistCard";
import Song from "./Song";

function User() {
	const [profileUser, setProfileUser] = useState({});
	const [songIdsNotInState, setSongIdsNotInState] = useState([]);
	const [playlistIdsNotInState, setPlaylistIdsNotInState] = useState([]);
	const { userId } = useParams();
	const [currentUserProfile, setCurrentUserProfile] = useState(false);
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.session.user);
	const currentUserFollows = useSelector(
		(state) => state.session.user.follows
	);
	const songs = useSelector((state) => state.songs);
	const playlists = useSelector((state) => state.playlists);
	const userPlaylists = useSelector((state) => state.userMusicInfo.playlists);
	const history = useHistory();

	const handlePlaylistDelete = async (playlistId) => {
		await dispatch(deletePlaylistThunk(playlistId));
		await dispatch(deleteUserPlaylist(playlistId));
		const user = await dispatch(getASingleUserThunk(userId));
		setProfileUser(user);
	};

	const handleSongDelete = async (songId) => {
		await dispatch(deleteSongThunk(songId));
		await dispatch(deleteUserSong(songId));
		const user = await dispatch(getASingleUserThunk(userId));
		setProfileUser(user);
	};

	const handleFollow = async () => {
		await dispatch(addFollowThunk(+userId));
	};

	const handleUnfollow = async () => {
		await dispatch(unfollowThunk(+userId));
	};

	useEffect(() => {
		(async () => {
			const user = await dispatch(getASingleUserThunk(userId));
			setProfileUser(user);
			if (user === undefined) {
				history.push(`/users/${currentUser.id}`);
			}
			// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", user);
		})();
	}, [userId, dispatch]);

	useEffect(() => {
		currentUser.id === profileUser?.id
			? setCurrentUserProfile(true)
			: setCurrentUserProfile(false);
	}, [profileUser, currentUser]);

	useEffect(() => {
		if (profileUser?.songIds) {
			profileUser.songIds.forEach((songId) => {
				if (!songs[songId]) {
					setSongIdsNotInState((prevState) => [...prevState, songId]);
				}
			});
		}

		if (profileUser?.playlistIds) {
			profileUser.playlistIds.forEach((playlistId) => {
				if (!playlists[playlistId]) {
					setPlaylistIdsNotInState((prevState) => [
						...prevState,
						playlistId,
					]);
				}
			});
		}
	}, [profileUser, songs, playlists]);

	useEffect(() => {
		if (songIdsNotInState.length) {
			dispatch(setPlaylistSongsThunk(songIdsNotInState));
		}
		if (playlistIdsNotInState.length) {
			dispatch(populatePlaylistFromArrThunk(playlistIdsNotInState));
		}
	}, [dispatch, songIdsNotInState, playlistIdsNotInState]);

	if (profileUser === undefined || !Object.keys(profileUser).length) {
		return null;
	}

	return (
		<div id="user-profile-container_div">
			{/* Simple user display at top of page */}
			<div id="user-profile-info_div">
				<img
					src={profileUser.profilePhotoUrl}
					className="user_profile-img"
					alt="User Profile Img"
				/>
				<p id="user-profile-profile_p">PROFILE</p>
				<h1 id="user-profile-username_h1">{profileUser.username}</h1>
				{/* <h3>{user.id}</h3> */}
				<p id="user-profile-count_p">
					{!currentUserProfile
						? profileUser.playlistIds.length
						: userPlaylists.length}{" "}
					created playlists ⚬ {profileUser.songIds.length} added songs
					{currentUserProfile
						? ` ⚬ ${currentUserFollows.length} users followed`
						: ""}
				</p>
				{/* follow button */}

				<div className="follow_btn_contianer">
					{currentUserProfile ? null : !currentUserFollows.includes(
							+userId
					  ) ? (
						<button onClick={handleFollow} className="follow_btn">
							FOLLOW
						</button>
					) : (
						<button onClick={handleUnfollow} className="follow_btn">
							UNFOLLOW
						</button>
					)}
				</div>
			</div>

			{/* List of user created playlists */}
			<div id="song-playlist-container_div">
				<h2 className="profile-section-title_h2">
					{currentUserProfile
						? "Your playlists"
						: `${profileUser.username}'s playlists`}
				</h2>
				<div className="user-profile-playlists_div">
					{!currentUserProfile
						? profileUser.playlistIds.map((playlistId) => (
								<div
									className="playlist-card_container"
									key={playlistId}
								>
									<PlaylistCard playlistId={playlistId} />
								</div>
						  ))
						: userPlaylists.map((playlistId) => (
								<div
									className="playlist-card_container"
									key={playlistId}
								>
									<PlaylistCard playlistId={playlistId} />
									{/* <p className='playlist-card_edit_btn'
											onClick={(e) => handlePlaylistDelete(e)}
											value={playlistId}
										> */}
									<div
										className="playlist-card_delete"
										onClick={() =>
											handlePlaylistDelete(playlistId)
										}
									>
										<p className="playlist-card_delete-span">
											<span className="allow-pointer-events material-icons">
												clear
											</span>
										</p>
									</div>
								</div>
						  ))}
				</div>

				{/* List of the users most recently added songs */}

				<h2
					id="profile-section-title_h2"
					className="profile-section-title_h2"
				>
					{currentUserProfile
						? "Your most recently added songs"
						: `${profileUser.username}'s most recently added songs`}
				</h2>

				<div id="song-info">
					<p className='playlist-title'>Title</p>
					<p className='playlist-artist'>Artist</p>
					<p className='playlist-album'>Album</p>
					<p className='playlist-date'>Date Added</p>
				</div>
				<div id="playlist-info-container_div">
					{profileUser.songIds.map((songId) => (
						<div
							className="playlist-song-container_div"
							key={songId}
						>
							<Song songId={songId} />
							{currentUserProfile && (
								<>
									<p
										onClick={() =>
											history.push(
												`/edit-song-form/${songId}`
											)
										}
									>
										<span className="material-icons allow-pointer-events">
											edit
										</span>
									</p>
									<p onClick={() => handleSongDelete(songId)}>
										<span className="material-icons allow-pointer-events">
											clear
										</span>
									</p>
								</>
							)}
						</div>
					))}
				</div>
				<h1 id="you-found-me">still being noesy</h1>
			</div>
		</div>
	);
}
export default User;
