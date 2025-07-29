import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import View from "./View";
import Queue from "./Queue";
import LyricsDisplay from "./Lyrics";
import FullScreenPlayer from "./FullScreenPlayer";

const Player = () => {
  const [showView, setShowView] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false); // New state for full screen
  const {
    track,
    seekBar,
    seekBg,
    play,
    playStatus,
    pause,
    time,
    previous,
    next,
    seekSong,
    volume,
    handleVolumeChange,
    isShuffleOn,
    toggleShuffle,
    isLoopOn,
    toggleLoop,
    currentPlaylist,
    playWithId,
    currentAlbumSongs,
    currentAlbumId,
  } = useContext(PlayerContext);

  return (
    <>
      {/* Main Player Controls - Ensure this has a z-index */}
      <div className="h-[10%] bg-black flex justify-between items-center px-4 text-white relative z-20">
        {" "}
        {/* Added relative z-20 */}
        <div className="hidden lg:flex items-center gap-4">
          <img className="w-12" src={track.image} alt="" />
          <div>
            <p className="truncate w-72">{track.name}</p>
            <p className="truncate w-72">{track.artist}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 m-auto">
          <div className="flex gap-4">
            <img
              onClick={() => toggleShuffle()}
              className={`w-4 cursor-pointer ${
                isShuffleOn ? "opacity-100" : "opacity-50"
              }`}
              src={assets.shuffle_icon}
              alt="Shuffle"
              title={isShuffleOn ? "Shuffle is on" : "Shuffle is off"}
            />
            <img
              onClick={previous}
              className="w-4 cursor-pointer"
              src={assets.prev_icon}
              alt=""
              title="Previous"
            />
            {playStatus ? (
              <img
                onClick={pause}
                className="w-4 cursor-pointer"
                src={assets.pause_icon}
                alt=""
                title="Pause"
              />
            ) : (
              <img
                onClick={play}
                className="w-4 cursor-pointer"
                src={assets.play_icon}
                alt=""
                title="Play"
              />
            )}
            <img
              onClick={next}
              className="w-4 cursor-pointer"
              src={assets.next_icon}
              alt=""
              title="Next"
            />
            <img
              onClick={toggleLoop}
              className={`w-4 cursor-pointer ${
                isLoopOn ? "opacity-100" : "opacity-50"
              }`}
              src={assets.loop_icon}
              alt="Loop"
              title={isLoopOn ? "Loop is on" : "Loop is off"}
            />
          </div>
          <div className="flex items-center gap-5">
            <p>
              {time.currentTime.minute}:{time.currentTime.second}
            </p>
            <div
              ref={seekBg}
              onClick={seekSong}
              className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer"
            >
              <hr
                ref={seekBar}
                className="h-1 border-none w-0 bg-blue-800 rounded-full"
              />
            </div>
            <p>
              {time.totalTime.minute}:{time.totalTime.second}
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 opacity-75">
          <img
            onClick={() => setShowView(!showView)}
            className={`w-5 cursor-pointer ${
              showView ? "opacity-100" : "opacity-50 hover:opacity-100"
            }`}
            src={assets.view_icon}
            alt="View"
            title={showView ? "Hide view" : "Show view"}
          />
          <img
            onClick={() => setShowLyrics(!showLyrics)}
            className={`w-5 cursor-pointer ${
              showLyrics ? "opacity-100" : "opacity-50 hover:opacity-100"
            }`}
            src={assets.mic_icon}
            alt="Lyrics"
            title={showLyrics ? "Hide Lyrics" : "Show Lyrics"}
          />
          <img
            onClick={() => setShowQueue(!showQueue)}
            className={`w-5 cursor-pointer ${
              showQueue ? "opacity-100" : "opacity-50 hover:opacity-100"
            }`}
            src={assets.queue_icon}
            alt="Queue"
            title={showQueue ? "Hide Queue" : "Show Queue"}
          />
          <img className="w-5" src={assets.speaker_icon} alt="" />
          <img className="w-5" src={assets.volume_icon} alt="" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-25 bg-slate-50 accent-slate-50 cursor-pointer hover:accent-blue-500"
          />
          <img
            className="w-5 cursor-pointer"
            src={assets.mini_player_icon}
            alt=""
          />
          <img
            onClick={() => setShowFullScreen(!showFullScreen)}
            className={`w-5 cursor-pointer ${
              showFullScreen ? "opacity-100" : "opacity-50 hover:opacity-100"
            }`}
            src={assets.zoom_icon}
            alt=""
            title={showFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
          />
        </div>
      </div>

      {/* View sidebar */}
      {showView && (
        <div className="fixed right-0 top-0 h-[90%] w-[20%] bg-[#121212] z-50 shadow-2xl">
          <View />
        </div>
      )}

      {/* Queue sidebar */}
      {showQueue && (
        <div className="fixed right-0 top-0 h-[90%] w-[20%] bg-[#121212] z-50 shadow-2xl">
          <Queue
            currentPlaylist={currentPlaylist}
            track={track}
            playWithId={playWithId}
            currentAlbumSongs={currentAlbumSongs}
            currentAlbumId={currentAlbumId}
          />
        </div>
      )}

      {/* Lyrics display */}
      {showLyrics && (
        <div
          className={`fixed top-0 h-[90%] bg-[#121212] z-50 p-4 overflow-y-auto border-r-8 border-black ${
            showFullScreen
              ? "left-0 w-[20%] shadow-2xl" // Styles when full screen is on 
              : "left-[24.9%] w-[55.5%]" // Default styles
          }`}
        >
          <LyricsDisplay currentTime={time.currentTime} track={track} />
        </div>
      )}

      {/* Full Screen Player */}
      {showFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-10 flex items-center justify-center pb-[10%]">
          {" "}
          {/* Changed z-index to 10 and added padding-bottom */}
          <FullScreenPlayer
            track={track}
            currentPlaylist={currentPlaylist}
            onClose={() => setShowFullScreen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Player;
