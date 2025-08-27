import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets, albumsData } from "../assets/assets";

const MobileFullScreenPlayer = ({ onClose }) => {
  const {
    track,
    playStatus,
    play,
    pause,
    previous,
    next,
    time,
    seekSong,
    seekBar,
    seekBg,
    isShuffleOn,
    toggleShuffle,
    isLoopOn,
    toggleLoop,
    currentAlbumId,
  } = useContext(PlayerContext);

  // Find the current album information
  const currentAlbum = albumsData.find((album) => album.id === currentAlbumId);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-12">
        <button onClick={onClose} className="text-white text-2xl font-bold">
          ×
        </button>
        <div className="text-center flex-1">
          <h1 className="text-white text-sm font-medium opacity-80">
            Now playing from your album
          </h1>
          <h2 className="text-white text-lg font-semibold">
            {currentAlbum ? currentAlbum.name : "Unknown Album"}
          </h2>
        </div>
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>

      {/* Song Cover */}
      <div className="flex-1 flex items-center justify-center px-8 mb-4">
        <div className="w-80 h-80 rounded-lg overflow-hidden shadow-2xl">
          <img
            src={track.image}
            alt={track.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Song Info */}
      <div className="px-8 mb-8">
        <div className="text-left">
          <h3 className="text-white text-xl font-bold mb-2 truncate">
            {track.name}
          </h3>
          <p className="text-white text-lg opacity-80 truncate">{track.artist}</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="px-8 mb-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-white text-sm mb-2">
            <span>
              {time.currentTime.minute}:{time.currentTime.second}
            </span>
            <span>
              {time.totalTime.minute}:{time.totalTime.second}
            </span>
          </div>
          <div
            ref={seekBg}
            onClick={seekSong}
            className="w-full bg-gray-600 rounded-full cursor-pointer h-2"
          >
            <div
              ref={seekBar}
              className="h-full bg-blue-500 rounded-full transition-all duration-100"
              style={{
                width: `${
                  ((time.currentTime.minute * 60 + time.currentTime.second) /
                    (time.totalTime.minute * 60 + time.totalTime.second)) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <img
            onClick={toggleShuffle}
            className={`w-5 cursor-pointer ${
              isShuffleOn ? "opacity-100" : "opacity-50"
            }`}
            src={assets.shuffle_icon}
            alt="Shuffle"
            title={isShuffleOn ? "Shuffle is on" : "Shuffle is off"}
          />
          <img
            onClick={previous}
            className="w-5 cursor-pointer"
            src={assets.prev_icon}
            alt=""
            title="Previous"
          />
          {playStatus ? (
            <img
              onClick={pause}
              className="w-5 cursor-pointer"
              src={assets.pause_icon}
              alt=""
              title="Pause"
            />
          ) : (
            <img
              onClick={play}
              className="w-5 cursor-pointer"
              src={assets.play_icon}
              alt=""
              title="Play"
            />
          )}
          <img
            onClick={next}
            className="w-5 cursor-pointer"
            src={assets.next_icon}
            alt=""
            title="Next"
          />
          <img
            onClick={toggleLoop}
            className={`w-5 cursor-pointer ${
              isLoopOn ? "opacity-100" : "opacity-50"
            }`}
            src={assets.loop_icon}
            alt="Loop"
            title={isLoopOn ? "Loop is on" : "Loop is off"}
          />
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-8"></div>
    </div>
  );
};

export default MobileFullScreenPlayer;
