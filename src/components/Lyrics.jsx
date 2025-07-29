import React, { useState, useEffect, useContext, useRef } from "react";
import { PlayerContext } from "../context/PlayerContext";

const LyricsDisplay = () => {
  const { track, time, seekSong, audioRef } = useContext(PlayerContext); // Destructure seekSong and audioRef
  const [parsedLyrics, setParsedLyrics] = useState([]);
  const lyricsContainerRef = useRef(null); // Ref for the lyrics container

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
      className="text-white p-4 overflow-y-auto h-full"
    >
      {" "}
      {/* Add ref here */}
      <h2 className="text-xl font-bold mb-4">{track?.name} - Lyrics</h2>
      {parsedLyrics.length > 0 ? (
        <div className="space-y-3">
          {parsedLyrics.map((line, index) => (
            <p
              key={index}
              className={`transition-all duration-200 cursor-pointer ${
                // Add cursor-pointer
                index === activeIndex
                  ? "text-blue-400 text-lg font-bold"
                  : "text-gray-400"
              }`}
              onClick={() => handleLyricClick(line.time)} // Add onClick handler
            >
              {line.text}
            </p>
          ))}
        </div>
      ) : (
        <div className="text-white">
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
