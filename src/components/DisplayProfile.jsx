// /DisplayProfile.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  assets,
  artistData,
  songsData,
  albumsData,
  projectsekaiSongs,
  jpopSongs,
} from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import AlbumItem from "./AlbumItem";
import EditProfileModal from "../components/EditProfileModal";

const DisplayProfile = () => {
  const { setGlobalSearchQuery, playWithId, userData, setUserData } =
    useContext(PlayerContext); // Consume userData and setUserData

  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);

  const topArtistsThisMonth = React.useMemo(() => {
    const shuffledArtists = [...artistData].sort(() => 0.5 - Math.random());
    return shuffledArtists.slice(0, 8);
  }, []);

  const topTracksThisMonth = React.useMemo(() => {
    const shuffledSongs = [...songsData].sort(() => 0.5 - Math.random());
    return shuffledSongs.slice(0, 5);
  }, []);

  const userPlaylists = React.useMemo(() => {
    return albumsData;
  }, []);

  useEffect(() => {
    setGlobalSearchQuery("");
  }, [setGlobalSearchQuery]);

  // Function to handle saving profile changes from the modal
  const handleSaveProfile = (newName, newProfilePic) => {
    // eslint-disable-next-line no-unused-vars
    let profilePicToSave = newProfilePic;

    // If newProfilePic is a File object, convert it to a data URL
    if (newProfilePic instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevData) => ({
          ...prevData,
          name: newName,
          profilePicture: reader.result,
        }));
        localStorage.setItem("userName", newName);
        localStorage.setItem("userProfilePicture", reader.result); // Save base64 string
      };
      reader.readAsDataURL(newProfilePic);
    } else {
      // If it's already a URL string (e.g., default or previously saved)
      setUserData((prevData) => ({
        ...prevData,
        name: newName,
        profilePicture: newProfilePic,
      }));
      localStorage.setItem("userName", newName);
      localStorage.setItem("userProfilePicture", newProfilePic);
    }
    setShowEditModal(false);
  };

  return (
    <>
      <div className="mt-10">
        {/* User Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 mb-10">
          {/* Profile Picture with Edit Overlay */}
          <div
            className="relative group cursor-pointer"
            onClick={() => setShowEditModal(true)}
          >
            <img
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-52 md:h-52 rounded-full object-cover"
              src={userData.profilePicture} // Use userData from context
              alt={userData.name}
            />
            {/* Edit Overlay */}
            <div className="absolute inset-0 bg-gray-500 bg-opacity-50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <img
                src={assets.edit_icon}
                alt="Edit"
                className="w-10 h-10 mb-2"
              />
              <p className="text-white text-lg font-semibold">Edit Profile</p>
            </div>
          </div>

          <div className="min-w-0 max-w-full text-center sm:text-left">
            <p className="text-xs sm:text-sm font-semibold">Profile</p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-1 sm:mb-2 leading-tight break-words truncate">
              {userData.name} {/* Use userData from context */}
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              <span className="font-normal">{albumsData.length}</span> Playlists
            </p>
          </div>
        </div>

        {/* Top Artists This Month */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-8">Top Artists This Month</h2>
          {topArtistsThisMonth.length > 0 ? (
            <div className="flex overflow-x-auto gap-2 sm:gap-4 pb-2 sm:pb-4">
              {topArtistsThisMonth.map((artist, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start flex-shrink-0 "
                >
                  <img
                    src={artist.profile}
                    alt={artist.name}
                    onClick={() => navigate(`/artist/${artist.id}`)}
                    className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full object-cover mb-2 cursor-pointer"
                  />
                  <p
                    className="font-medium hover:underline cursor-pointer truncate w-20 md:w-32"
                    onClick={() => navigate(`/artist/${artist.id}`)}
                  >
                    {artist.name}
                  </p>
                  <p className="font-normal text-gray-300">Artist</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No top artists this month.</p>
          )}
        </div>

        {/* Top Tracks This Month */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Top Tracks This Month</h2>
          {topTracksThisMonth.length > 0 ? (
            <div className="grid grid-cols-1 gap-1 sm:gap-2">
              {" "}
              {topTracksThisMonth.map((song, index) => (
                <div
                  key={index}
                  onClick={() => playWithId(song.id)}
                  className="flex items-center justify-between gap-1 sm:gap-2 p-1.5 sm:p-2 pr-6 sm:pr-16 hover:bg-[#2a2a2a] rounded cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {" "}
                    {/* New div for image and text */}
                    <b className="text-gray-400 font-normal w-4 text-center">
                      {index + 1}
                    </b>
                    <img
                      src={song.image}
                      alt={song.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium truncate w-32 sm:w-52">
                        {song.name}
                      </p>
                      <p className="text-gray-400 text-sm truncate w-32 sm:w-52">
                        {song.artist}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm hidden sm:block">
                    {song.duration}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No top tracks this month.</p>
          )}
        </div>

        {/* All Playlists */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">My Playlists</h2>
          {userPlaylists.length > 0 ? (
            <div className="flex overflow-x-auto gap-2 pb-4">
              {userPlaylists.map((playlist, index) => (
                <AlbumItem
                  key={index}
                  name={playlist.name}
                  desc={playlist.desc}
                  id={playlist.id}
                  image={playlist.image}
                  songsData={
                    playlist.id === 1
                      ? songsData.filter(
                          (song) =>
                            song.artist && song.artist.includes("Camellia")
                        )
                      : playlist.id === 2
                      ? songsData.filter(
                          (song) => song.artist && song.artist.includes("XI")
                        )
                      : playlist.id === 3
                      ? songsData.filter(
                          (song) =>
                            song.artist && song.artist.includes("t+pazolite")
                        )
                      : playlist.id === 4
                      ? songsData.filter(
                          (song) =>
                            (song.artist &&
                              song.artist.includes("Hatsune Miku")) ||
                            (song.singer &&
                              song.singer.includes("Hatsune Miku"))
                        )
                      : playlist.id === 5
                      ? projectsekaiSongs
                      : playlist.id === 6
                      ? jpopSongs
                      : songsData
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">You don't have any playlists yet.</p>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentName={userData.name}
        currentProfilePicture={userData.profilePicture}
        onSave={handleSaveProfile}
      />
    </>
  );
};

export default DisplayProfile;
