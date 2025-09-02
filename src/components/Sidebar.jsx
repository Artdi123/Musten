// FileName: /Sidebar.jsx
import React, { useContext } from "react";
import { assets, albumsData } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { setGlobalSearchQuery, currentAlbumId} =
    useContext(PlayerContext); // Destructure currentAlbumId and track

  return (
    <div className="w-[20%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] h-[10%] rounded flex flex-col justify-around">
        <div
          onClick={() => {
            navigate("/");
            setGlobalSearchQuery("");
          }}
          className="flex items-center gap-3 pl-8 cursor-pointer hover:bg-[#2a2a2a] p-2 rounded"
        >
          <img className="w-6" src={assets.home_icon} alt="" />
          <p className="font-bold"> Home </p>
        </div>

      </div>
      <div className="bg-[#121212] h-[90%] rounded">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-8" src={assets.stack_icon} alt="" />
            <p className="font-semibold"> Your Library</p>
          </div>
          <div className="flex items-center gap-3">
            <img
              className="w-5 cursor-pointer"
              src={assets.arrow_icon}
              alt=""
            />
            <img className="w-5 cursor-pointer" src={assets.plus_icon} alt="" />
          </div>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
          {localStorage.getItem('currentUser') ? (
            albumsData.map((item, index) => {
              // Check if the current track belongs to this album
              const isAlbumPlaying = currentAlbumId === item.id;
              const albumNameClass = isAlbumPlaying ? "text-blue-500" : "";

              return (
                <div
                  key={index}
                  onClick={() => {
                    navigate(`/album/${item.id}`);
                    setGlobalSearchQuery("");
                  }}
                  className="flex items-center gap-3 p-2 hover:bg-[#2a2a2a] rounded cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className={`font-medium ${albumNameClass}`}>{item.name}</p>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p>Please login to view your library</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
