import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";

const SearchListItem = ({ item, type }) => {
  const navigate = useNavigate();
  const { playWithId } = useContext(PlayerContext);

  const handleClick = () => {
    if (type === "album") {
      navigate(`/album/${item.id}`);
    } else if (type === "song") {
      playWithId(item.id);
    } else if (type === "artist") {
      // NEW: Handle artist clicks
      navigate(`/artist/${item.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-2 hover:bg-[#2a2a2a] rounded cursor-pointer"
    >
      <img
        src={type === "artist" ? item.profile : item.image} // Use item.profile for artists
        alt={item.name}
        className={`w-12 h-12 object-cover ${
          type === "artist" ? "rounded-full" : "rounded"
        }`} // Make artist images round
      />
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-gray-400 text-sm">
          {type === "album"
            ? item.desc
            : type === "song"
            ? item.artist
            : type === "artist"
            ? item.Listener // Display Listener for artists
            : ""}
        </p>
      </div>
    </div>
  );
};

export default SearchListItem;
