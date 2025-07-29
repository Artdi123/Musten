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
      className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <img className="rounded" src={image} alt={name} />
      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-slate-200 text-sm">{desc}</p>
    </div>
  );
};

export default AlbumItem;
