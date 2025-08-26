import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext"; // Adjust the import path as necessary

const AlbumItem = ({ image, name, desc, id, songsData }) => {
  const navigate = useNavigate();
  const { setCurrentAlbumSongs, setCurrentAlbumId } = useContext(PlayerContext); // Destructure setCurrentAlbumSongs and setCurrentAlbumId

  const handleAlbumClick = () => {
    // Navigate to the album page
    navigate(`/album/${id}`);

    // Set the current album's songs and ID without playing
    if (songsData && songsData.length > 0) {
      setCurrentAlbumSongs(songsData);
      setCurrentAlbumId(id);
    }
  };

  return (
    <div
      onClick={handleAlbumClick}
      className="min-w-[120px] sm:min-w-[200px] p-2 px-1 sm:px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <img
        className="rounded w-28 h-28 sm:w-44 sm:h-44 md:w-44 md:h-44 lg:w-[200px] object-cover"
        src={image}
        alt={name}
      />
      <p className="font-bold mt-2 mb-1 truncate max-w-[9rem] sm:max-w-[10rem]">
        {name}
      </p>
      <p className="text-slate-200 text-sm truncate max-w-[9rem] sm:max-w-[10rem]">
        {desc}
      </p>
    </div>
  );
};

export default AlbumItem;
