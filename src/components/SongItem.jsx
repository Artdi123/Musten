import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

const SongItem = ({ name, image, artist, id }) => {
  const { playWithId } = useContext(PlayerContext);

  return (
    <div
      onClick={() => playWithId(id)}
      className="min-w-[120px] sm:min-w-[200px] p-2 px-1 sm:px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <img
        className="rounded w-28 h-28 sm:w-44 sm:h-44 md:w-44 md:h-44 lg:w-[200px] object-cover"
        src={image}
        alt=""
      />
      <p className="font-bold mt-2 mb-1 text-sm truncate">{name}</p>
      <p className="text-slate-200 text-sm truncate">{artist}</p>
    </div>
  );
};

export default SongItem;
