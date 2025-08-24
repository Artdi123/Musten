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

  // Function to determine which album a song actually belongs to
  const getSongAlbum = (song) => {
    if (song.album) {
      return song.album;
    }
    
    // Check if song has "Hatsune Miku" as a singer
    if (song.singer && song.singer.includes("Hatsune Miku")) {
      return "Hatsune Miku Album";
    }
    
    // Check if song has "Hatsune Miku" in the artist field
    if (song.artist && song.artist.includes("Hatsune Miku")) {
      return "Hatsune Miku Album";
    }
    
    if (song.artist === "Camellia") {
      return "Camellia Album";
    } else if (projectsekaiSongs.some(ps => ps.id === song.id)) {
      return "Project Sekai Song Album";
    } else if (jpopSongs.some(js => js.id === song.id)) {
      return "Jpop & Other Album";
    } else {
      return "Liked Song";
    }
  };

  // Find which album the track belongs to
  const getAlbumData = () => {
    // Check if track has album property first
    if (track.album) {
      return albumsData.find((album) => album.name === track.album);
    }
    
    // Use the getSongAlbum function to determine the album
    const albumName = getSongAlbum(track);
    return albumsData.find((album) => album.name === albumName);
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
    <div className="w-full bg-[#121212] h-full overflow-y-auto p-4 text-white">
      <h1 className="text-xl font-bold mb-4">
        {album?.name || "Now Playing"}
      </h1>

      <div className="flex flex-col items-start justify-center mb-6">
        <img
          src={track.image}
          alt={track.name}
          className="w-full aspect-square object-cover rounded-md mb-4"
        />
        <div className="overflow-hidden w-full">
          <h2 className="text-lg font-bold truncate">{track.name}</h2>
        </div>
        <p className="text-gray-400 text-sm truncate w-full">{track.artist}</p>
      </div>

      <div className="mb-6 p-3 bg-[#1f1e1e] rounded">
        <h3 className="text-base font-bold mb-3">About the artist</h3>
        <div className="flex items-center mb-3">
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/artist/${artist.id}`)}
          >
            <img
              src={artist.profile}
              alt={artist.name}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4
              className="font-bold truncate cursor-pointer hover:underline"
              onClick={() => navigate(`/artist/${artist.id}`)}
            >
              {artist.name}
            </h4>
            <p className="text-sm text-gray-400">{artist.Listener}</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 max-h-[80px] overflow-y-auto">
          {artist.desc || "No artist description available."}
        </p>
      </div>

      {/* Next in Queue Section */}
      <div className="mb-6 p-3 bg-[#1f1e1e] rounded">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-bold">Next in Queue</h3>
        </div>
        {nextSong ? (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => playWithId(nextSong.id)}
          >
            <img
              src={nextSong.image}
              alt={nextSong.name}
              className="w-10 h-10 rounded object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{nextSong.name}</p>
              <p className="text-gray-400 text-sm truncate">
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
