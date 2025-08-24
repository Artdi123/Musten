// FileName: /Queue.jsx
import React from "react";
import { albumsData } from "../assets/assets"; // Import albumsData

const Queue = ({ currentPlaylist, track, playWithId, currentAlbumId }) => {
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
    <div className="w-full bg-[#121212] h-full overflow-y-auto p-6 text-white">
      {track && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Currently Playing</h3>
          <div className="flex items-center gap-3 p-2 rounded-md bg-[#282828]">
            <img src={track.image} alt="" className="w-12 h-12 rounded" />
            <div>
              <p className="text-base truncate w-60">{track.name}</p>
              <p className="text-sm text-gray-400 truncate w-40">
                {track.artist}
              </p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-4">{queueTitle}</h2>
      {upcomingSongs.length === 0 ? (
        <p>No upcoming songs in the queue.</p>
      ) : (
        <ul>
          {upcomingSongs.map((song, index) => (
            <li
              key={`${song.id}-${index}`}
              onClick={() => playWithId(song.id)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-[#282828]`}
            >
              <img src={song.image} alt="" className="w-10 h-10 rounded" />
              <div>
                <p className="text-sm truncate w-60">{song.name}</p>
                <p className="text-xs text-gray-400 truncate w-40">
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
