import React, { useContext, useRef, useEffect } from "react"; // Import useRef and useEffect
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import { artistData } from "../assets/assets";

const FullScreenPlayer = ({ track, currentPlaylist, onClose }) => {
  const { playStatus, audioRef } = useContext(PlayerContext); // Get playStatus and audioRef from context
  const navigate = useNavigate(); // Use navigate for routing
  const videoRef = useRef(null); // Create a ref for the video element

  // Find matching artist data for the current track
  const getArtistData = () => {
    let artist = artistData.find((a) =>
      track.artist.split(",").some((artistName) => artistName.trim() === a.name)
    );

    if (!artist) {
      artist = artistData.find((a) =>
        track.artist.toLowerCase().includes(a.name.toLowerCase())
      );
    }

    return (
      artist || {
        name: track.artist,
        desc: "No artist description available.",
        profile: track.image,
        Listener: "",
      }
    );
  };

  const artist = getArtistData();

  // Find the next song in the queue
  const currentIndex = currentPlaylist.findIndex(
    (song) => song.id === track.id
  );
  const nextSong =
    currentIndex !== -1 && currentIndex < currentPlaylist.length - 1
      ? currentPlaylist[currentIndex + 1]
      : null;

  // Effect to synchronize video play/pause with audio playStatus
  useEffect(() => {
    if (videoRef.current) {
      if (playStatus) {
        videoRef.current
          .play()
          .catch((e) => console.error("Video play failed:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [playStatus, track]); // Re-run when playStatus or track changes

  // Effect to handle video volume and initial autoplay
  useEffect(() => {
    if (videoRef.current && audioRef.current) {
      // Mute video initially for autoplay, then sync volume
      videoRef.current.muted = true; // Ensure muted for autoplay
      videoRef.current.volume = audioRef.current.volume; // Sync volume

      const handleAudioVolumeChange = () => {
        if (videoRef.current) {
          videoRef.current.volume = audioRef.current.volume;
        }
      };

      audioRef.current.addEventListener(
        "volumechange",
        handleAudioVolumeChange
      );

      return () => {
        if (audioRef.current) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          audioRef.current.removeEventListener(
            "volumechange",
            handleAudioVolumeChange
          );
        }
      };
    }
  }, [audioRef]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-black text-white p-8">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl p-2 rounded-full hover:bg-gray-700 z-10"
        title="Exit Full Screen"
      >
        &times;
      </button>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-4xl">
        {/* Song Cover or Video */}
        <div className="mb-8 w-full max-w-[800px] h-[450px] flex items-center justify-center">
          {" "}
          {/* Adjusted container for video */}
          {track.video ? (
            <video
              ref={videoRef} // Assign the ref to the video element
              src={track.video}
              autoPlay // Attempt to autoplay
              loop // Loop the video
              muted // Mute initially for autoplay to work
              playsInline // Important for iOS autoplay
              className="w-full h-full object-contain rounded-lg shadow-lg" // Use object-contain to prevent cropping
              onLoadedMetadata={() => {
                if (videoRef.current && playStatus) {
                  videoRef.current
                    .play()
                    .catch((e) =>
                      console.error("Video play failed on load:", e)
                    );
                }
              }}
              onTimeUpdate={() => {
                // Optional: Sync video time with audio time if needed, but usually audio is master
                if (
                  videoRef.current &&
                  audioRef.current &&
                  Math.abs(
                    videoRef.current.currentTime - audioRef.current.currentTime
                  ) > 0.5
                ) {
                  videoRef.current.currentTime = audioRef.current.currentTime;
                }
              }}
            />
          ) : (
            <img
              src={track.image}
              alt={track.name}
              className="w-[400px] h-[400px] object-cover rounded-lg shadow-lg mt-32 mb-16"
            />
          )}
        </div>

        {/* Bottom Section: Artist Description and Next in Queue */}
        <div className="w-full flex justify-between items-center gap-6">
          {/* Artist Description (Left Below) */}
          <div className="w-1/2 bg-[#121212] p-4">
            <h3 className="text-xl font-bold mb-4">About the Artist</h3>
            <div className="flex gap-3 justify-between items-center">
              <div className="hidden lg:flex items-center gap-4">
                <img
                  className="w-10 h-10 rounded object-cover cursor-pointer"
                  onClick={() => navigate(`/artist/${artist.id}`)}
                  src={artist.profile}
                  alt="" />
                <div>
                  <p className="truncate w-72 text-sm hover:underline cursor-pointer" onClick={() => navigate(`/artist/${artist.id}`)}>{artist.name}</p>
                  <p className="truncate w-72 text-sm">{artist.Listener}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Song in Queue (Right Below) */}
          <div className="w-1/2 bg-[#121212] p-4 ">
            <h3 className="text-xl font-bold mb-4">Next in Queue</h3>
            {nextSong ? (
              <div className="flex gap-3 justify-between items-center">
                <div className="hidden lg:flex items-center gap-4">
                  <img className="w-10 h-10 rounded object-cover" src={nextSong.image} alt="" />
                  <div>
                    <p className="truncate w-72 text-sm">{nextSong.name}</p>
                    <p className="truncate w-72 text-sm">{nextSong.artist}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No more songs in queue.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenPlayer;
