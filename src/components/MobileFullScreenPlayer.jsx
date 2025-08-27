import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import { assets, albumsData, artistData } from "../assets/assets";
import MobileLyricsFullscreen from "./MobileLyricsFullscreen";

const MobileFullScreenPlayer = ({ onClose }) => {
  const [showLyrics, setShowLyrics] = useState(false);
  const navigate = useNavigate();
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

  // Find matching artist data
  const getArtistData = () => {
    // Try to find by exact name match first
    let artist = artistData.find((a) =>
      track.artist.split(",").some((artistName) => artistName.trim() === a.name)
    );

    // If not found, try partial match
    if (!artist) {
      artist = artistData.find((a) =>
        track.artist.toLowerCase().includes(a.name.toLowerCase())
      );
    }

    // Fallback to track info if no artist data found
    return (
      artist || {
        name: track.artist,
        desc: "",
        profile: track.image,
        Listener: "",
      }
    );
  };

  const artist = getArtistData();

  return (
    <>
      <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-y-auto">
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
        <div className="flex items-center justify-center px-8 mb-4 py-8">
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
            <p className="text-white text-lg opacity-80 truncate">
              {track.artist}
            </p>
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

        {/* Lyrics Preview */}
        <div className="px-8 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white text-sm font-medium">Lyrics Preview</h4>
              <button
                onClick={() => setShowLyrics(true)}
                className="text-blue-400 text-sm hover:text-blue-300 transition-colors font-medium px-3 py-1 rounded bg-blue-900 bg-opacity-30"
              >
                Show Lyrics
              </button>
            </div>
            <div className="text-white text-xs opacity-70 leading-relaxed max-h-20 overflow-hidden">
              {track.lyrics ? (
                (() => {
                  const parsedLyrics = track.lyrics
                    .split("\n")
                    .map((line) => {
                      const cleanLine = line.trim();
                      const match = cleanLine.match(
                        /^\[?(\d+):(\d+)(?:\.(\d+))?\]?(.*)/
                      );
                      if (!match) return null;
                      const text = match[4].trim();
                      return text;
                    })
                    .filter((text) => text && text.length > 0)
                    .slice(0, 4);

                  return parsedLyrics.map((text, index) => (
                    <p key={index} className="mb-1">
                      {text}
                    </p>
                  ));
                })()
              ) : (
                <p>No lyrics available for this song.</p>
              )}
            </div>
          </div>
        </div>

        {/* About Artist */}
        <div className="px-8 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white text-sm font-medium mb-3">
              About the artist
            </h4>
            <div
              className="flex items-center mb-3 cursor-pointer"
              onClick={() => {
                navigate(`/artist/${artist.id}`);
                onClose(); // Close the mobile fullscreen player
              }}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <img
                  src={artist.profile}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-bold text-white text-sm truncate">
                  {artist.name}
                </h5>
                <p className="text-xs text-gray-400">{artist.Listener}</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 max-h-16 overflow-y-auto leading-relaxed">
              {artist.desc || "No artist description available."}
            </p>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>

      {/* Lyrics Fullscreen */}
      {showLyrics && (
        <MobileLyricsFullscreen
          track={track}
          onClose={() => setShowLyrics(false)}
        />
      )}
    </>
  );
};

export default MobileFullScreenPlayer;
