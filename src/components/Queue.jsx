// FileName: /Queue.jsx
import React from "react";
import { albumsData } from "../assets/assets"; // Import albumsData

const Queue = ({ currentPlaylist, track, playWithId, currentAlbumId }) => {
  // Find the index of the currently playing track
  const currentIndex = currentPlaylist.findIndex(
    (song) => song.id === track.id
  );

  // Filter the playlist to show only songs after the current one
  const upcomingSongs = currentPlaylist.slice(currentIndex + 1);

  // Determine the current album name
  const currentAlbum = albumsData.find((album) => album.id === currentAlbumId);
  const queueTitle = currentAlbum
    ? `Next From: ${currentAlbum.name}`
    : "Next Song";

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
          {upcomingSongs.map((song) => (
            <li
              key={song.id}
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
