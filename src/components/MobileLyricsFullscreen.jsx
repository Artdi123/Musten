import React, { useContext, useState, useEffect, useRef } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets";

const MobileLyricsFullscreen = ({ track, onClose }) => {
  const {
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
    audioRef,
  } = useContext(PlayerContext);

  const [parsedLyrics, setParsedLyrics] = useState([]);
  const lyricsContainerRef = useRef(null);
  const activeLyricRef = useRef(null);

  // Parse lyrics to remove timestamps
  useEffect(() => {
    if (!track?.lyrics) {
      setParsedLyrics([]);
      return;
    }

    const parseLyrics = (lyricsText) => {
      return lyricsText
        .split("\n")
        .map((line) => {
          const cleanLine = line.trim();
          const match = cleanLine.match(/^\[?(\d+):(\d+)(?:\.(\d+))?\]?(.*)/);

          if (!match) return null;

          const minutes = parseInt(match[1]);
          const seconds = parseInt(match[2]);
          const milliseconds = match[3] ? parseInt(match[3]) : 0;
          const text = match[4].trim();

          return {
            time: minutes * 60 + seconds + milliseconds / 100,
            text: text,
          };
        })
        .filter((line) => line !== null && line.text);
    };

    setParsedLyrics(parseLyrics(track.lyrics));
  }, [track]);

  const currentTime = time.currentTime.minute * 60 + time.currentTime.second;
  const activeIndex = parsedLyrics.findLastIndex(
    (line) => line.time <= currentTime
  );

  // Smooth scroll to active lyric
  useEffect(() => {
    if (activeLyricRef.current && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const activeElement = activeLyricRef.current;

      // Calculate the scroll position to center the active lyric
      const containerHeight = container.clientHeight;
      const elementTop = activeElement.offsetTop;
      const elementHeight = activeElement.clientHeight;

      // Center the active lyric in the container
      const scrollTop = elementTop - containerHeight / 2 + elementHeight / 2;

      // Smooth scroll to the position
      container.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  }, [activeIndex, currentTime]);

  const handleLyricClick = (lineTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = lineTime;
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[60] flex flex-col">
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 py-6">
        <button
          onClick={onClose}
          className="absolute left-4 text-white text-2xl font-bold"
        >
          ×
        </button>
        <div className="text-center">
          <h1 className="text-white text-lg font-semibold">Lyrics</h1>
          <h2 className="text-white text-sm opacity-80">{track.name}</h2>
        </div>
      </div>

      {/* Lyrics Content - Takes most of the space */}
      <div className="flex-1 px-6 overflow-y-auto" ref={lyricsContainerRef}>
        <div className="text-white text-sm leading-relaxed py-4">
          {parsedLyrics.length > 0 ? (
            <div className="space-y-4">
              {parsedLyrics.map((line, index) => (
                <p
                  key={index}
                  ref={index === activeIndex ? activeLyricRef : null}
                  className={`transition-all duration-300 cursor-pointer text-center ${
                    index === activeIndex
                      ? "text-blue-400 text-lg font-bold scale-105"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                  onClick={() => handleLyricClick(line.time)}
                >
                  {line.text}
                </p>
              ))}
            </div>
          ) : (
            <div className="text-center opacity-70">
              {track.lyrics ? (
                <>
                  <p className="mb-4">Raw Lyrics</p>
                  <pre className="whitespace-pre-wrap text-xs">
                    {track.lyrics}
                  </pre>
                </>
              ) : (
                <p>No lyrics available for this song.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Player Controls - Fixed at bottom */}
      <div className="px-6 py-4 bg-gray-900">
        {/* Progress Bar */}
        <div className="mb-4">
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
        <div className="flex items-center justify-center gap-4">
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
    </div>
  );
};

export default MobileLyricsFullscreen;
