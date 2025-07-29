// FileName: /View.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import {
  artistData,
  albumsData,
  projectsekaiSongs,
  jpopSongs,
} from "../assets/assets";

const View = () => {
  const { track, currentPlaylist, playWithId } = useContext(PlayerContext); 
  const navigate = useNavigate();

  // Find matching artist data
  const getArtistData = () => {
    // Try to find by exact name match first
    let artist = artistData.find((a) =>
      track.artist.split(",").some((artistName) => artistName.trim() === a.name)
    );

    // If not found, try partial match
    if (!artist) {
      artist = artistData.find((a) =>
        track.artist.toLowerCase().includes(a.name.toLowerCase())
      );
    }

    // Fallback to track info if no artist data found
    return (
      artist || {
        name: track.artist,
        desc: "",
        profile: track.image,
        Listener: "",
      }
    );
  };

  // Find which album the track belongs to
  const getAlbumData = () => {
    // Check project sekai songs
    if (projectsekaiSongs.some((song) => song.id === track.id)) {
      return albumsData.find((album) => album.name === "Project Sekai Song");
    }
    // Check jpop songs
    if (jpopSongs.some((song) => song.id === track.id)) {
      return albumsData.find((album) => album.name === "Jpop & Others");
    }
    // Check other albums based on artist
    if (track.artist.includes("Camellia")) {
      return albumsData.find((album) => album.name === "Camellia Album");
    }
    if (track.artist.includes("XI")) {
      return albumsData.find((album) => album.name === "XI Album");
    }
    if (track.artist.includes("t+pazolite")) {
      return albumsData.find((album) => album.name === "t+Pazolite Album");
    }
    if (track.artist.includes("Hatsune Miku")) {
      return albumsData.find((album) => album.name === "Hatsune Miku Album");
    }
    // Default to Liked Songs
    return albumsData.find((album) => album.name === "Liked Song");
  };

  const album = getAlbumData();
  const artist = getArtistData();

  // Find the next song in the queue
  const currentIndex = currentPlaylist.findIndex(
    (song) => song.id === track.id
  );
  const nextSong =
    currentIndex !== -1 && currentIndex < currentPlaylist.length - 1
      ? currentPlaylist[currentIndex + 1]
      : null;

  return (
    <div className="w-full bg-[#121212] h-full overflow-y-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        {album?.name || "Now Playing"}
      </h1>

      <div className="flex flex-col items-start justify-center mb-8">
        <img
          src={track.image}
          alt={track.name}
          className="w-[300px] h-[300px] object-cover rounded-md mb-4"
        />
        <div className="overflow-hidden">
          <h2 className="text-xl font-bold">{track.name}</h2>
        </div>
        <p className="text-gray-400">{track.artist}</p>
      </div>

      <div className="mb-6 p-3 bg-[#1f1e1e] rounded">
        <h3 className="text-lg font-bold mb-4">About the artist</h3>
        <div className="flex items-center mb-4">
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/artist/${artist.id}`)}
          >
            <img
              src={artist.profile}
              alt={artist.name}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
          </div>
          <div>
            <h4
              className="font-bold w-56 truncate cursor-pointer hover:underline"
              onClick={() => navigate(`/artist/${artist.id}`)}
            >
              {artist.name}
            </h4>
            <p className="text-sm text-gray-400">{artist.Listener}</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 max-h-[100px] overflow-y-auto">
          {artist.desc || "No artist description available."}
        </p>
      </div>

      {/* Next in Queue Section */}
      <div className="mb-6 p-3 bg-[#1f1e1e] rounded">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Next in Queue</h3>
        </div>
        {nextSong ? (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => playWithId(nextSong.id)}
          >
            <img
              src={nextSong.image}
              alt={nextSong.name}
              className="w-12 h-12 rounded object-cover"
            />
            <div>
              <p className="font-medium truncate w-48">{nextSong.name}</p>
              <p className="text-gray-400 text-sm truncate w-48">
                {nextSong.artist}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No more songs in queue.</p>
        )}
      </div>
    </div>
  );
};

export default View;
