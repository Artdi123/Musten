// FileName: /Queue.jsx
import React from "react";
import { albumsData, projectsekaiSongs, jpopSongs } from "../assets/assets"; // Import additional data

const Queue = ({ currentPlaylist, track, playWithId, currentAlbumId }) => {
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

  // Find the index of the currently playing track
  const currentIndex = currentPlaylist.findIndex(
    (song) => song.id === track.id
  );

  // Get the next 20 upcoming songs, looping back to the beginning if needed
  const getUpcomingSongs = () => {
    const upcomingSongs = [];
    const playlistLength = currentPlaylist.length;
    
    // Start from the next song after current
    let startIndex = currentIndex + 1;
    
    // Get up to 20 songs
    for (let i = 0; i < 20; i++) {
      const songIndex = (startIndex + i) % playlistLength;
      upcomingSongs.push(currentPlaylist[songIndex]);
    }
    
    return upcomingSongs;
  };

  const upcomingSongs = getUpcomingSongs();

  // Determine the current album name
  const currentAlbum = albumsData.find((album) => album.id === currentAlbumId);
  const queueTitle = currentAlbum
    ? `Next Songs from: ${currentAlbum.name}`
    : "Next Songs";

  return (
    <div className="w-full bg-[#121212] h-full overflow-y-auto p-4 text-white">
      {track && (
        <div className="mb-4">
          <h3 className="text-base font-semibold">Currently Playing</h3>
          <div className="flex items-center gap-3 p-2 rounded-md bg-[#282828]">
            <img src={track.image} alt="" className="w-10 h-10 rounded flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm truncate">{track.name}</p>
              <p className="text-xs text-gray-400 truncate">
                {track.artist}
              </p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-base font-semibold mb-4">{queueTitle}</h2>
      {upcomingSongs.length === 0 ? (
        <p className="text-sm">No upcoming songs in the queue.</p>
      ) : (
        <ul>
          {upcomingSongs.map((song, index) => (
            <li
              key={`${song.id}-${index}`}
              onClick={() => playWithId(song.id)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-[#282828]`}
            >
              <img src={song.image} alt="" className="w-8 h-8 rounded flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{song.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {song.artist}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Queue;
