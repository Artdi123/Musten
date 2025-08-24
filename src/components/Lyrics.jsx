import React, { useState, useEffect, useContext, useRef } from "react";
import { PlayerContext } from "../context/PlayerContext";

const LyricsDisplay = () => {
  const { track, time, seekSong, audioRef } = useContext(PlayerContext); // Destructure seekSong and audioRef
  const [parsedLyrics, setParsedLyrics] = useState([]);
  const lyricsContainerRef = useRef(null); // Ref for the lyrics container
  const activeLyricRef = useRef(null); // Ref for the currently active lyric line

  useEffect(() => {
    if (!track?.lyrics) {
      setParsedLyrics([]);
      return;
    }

    const parseLyrics = (lyricsText) => {
      return lyricsText
        .split("\n")
        .map((line) => {
          // Remove leading/trailing whitespace first
          const cleanLine = line.trim();

          // Flexible regex that handles:
          // - Optional leading [
          // - Optional trailing ]
          // - Optional milliseconds
          // - Leading whitespace (already trimmed)
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
      const scrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);
      
      // Smooth scroll to the position
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, [activeIndex, currentTime]);

  const handleLyricClick = (lineTime) => {
    if (audioRef.current && seekSong) {
      audioRef.current.currentTime = lineTime;
      // The seekSong function from PlayerContext already handles updating the seekbar
      // and time display, so we just need to set the audio's currentTime.
    }
  };

  return (
    <div
      ref={lyricsContainerRef}
      className="text-white p-4 overflow-y-auto h-full scroll-smooth"
    >
      {" "}
      {/* Restored padding since parent container no longer has padding */}
      <h2 className="text-xl font-bold mb-4 text-center">{track?.name} - Lyrics</h2>
      {parsedLyrics.length > 0 ? (
        <div className="space-y-3 w-full">
          {parsedLyrics.map((line, index) => (
            <p
              key={index}
              ref={index === activeIndex ? activeLyricRef : null} // Assign ref to active lyric
              className={`transition-all duration-300 cursor-pointer text-center w-full ${
                // Add cursor-pointer and smooth transition
                index === activeIndex
                  ? "text-blue-400 text-lg font-bold scale-105" // Added scale effect for active lyric
                  : "text-gray-400 hover:text-gray-300" // Added hover effect
              }`}
              onClick={() => handleLyricClick(line.time)} // Add onClick handler
            >
              {line.text}
            </p>
          ))}
        </div>
      ) : (
        <div className="text-white text-center w-full">
          {track?.lyrics ? (
            <>
              <p>Raw Lyrics</p>
              <pre className="mt-2 whitespace-pre-wrap rounded">
                {track.lyrics}
              </pre>
            </>
          ) : (
            <p>No lyrics available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LyricsDisplay;
