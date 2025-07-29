// FileName: /PlayerContext.jsx
import { createContext, useEffect, useRef, useState } from "react";
import { songsData, assets } from "../assets/assets"; // Import assets to get profile_icon
import { useCallback } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  // Load last played song from localStorage or default to the first song
  const initialTrackId = localStorage.getItem("lastPlayedSongId");
  const initialTrack = initialTrackId
    ? songsData.find((song) => song.id.toString() === initialTrackId) ||
      songsData[0]
    : songsData[0];

  // Load profile picture from localStorage or use default
  const initialProfilePicture =
    localStorage.getItem("userProfilePicture") || assets.profile_icon;
  const initialUserName = localStorage.getItem("userName") || "Artdi.";

  const [track, setTrack] = useState(initialTrack);
  const [playStatus, setPlayStatus] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isLoopOn, setIsLoopOn] = useState(false);
  const [shuffledPlaylist, setShuffledPlaylist] = useState([...songsData]);
  const [currentPlaylist, setCurrentPlaylist] = useState(songsData);
  const [currentAlbumSongs, setCurrentAlbumSongs] = useState(songsData);
  const [currentAlbumId, setCurrentAlbumId] = useState(null);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  // New state for user data
  const [userData, setUserData] = useState({
    name: initialUserName,
    profilePicture: initialProfilePicture,
  });

  // Effect to load saved time when audio is ready
  useEffect(() => {
    const savedTime = localStorage.getItem("lastPlayedSongTime");
    if (
      audioRef.current &&
      savedTime &&
      track.id.toString() === initialTrackId
    ) {
      const setAudioCurrentTime = () => {
        audioRef.current.currentTime = parseFloat(savedTime);
        audioRef.current.removeEventListener(
          "canplaythrough",
          setAudioCurrentTime
        );
      };
      audioRef.current.addEventListener("canplaythrough", setAudioCurrentTime);
      if (audioRef.current.readyState >= 4) {
        setAudioCurrentTime();
      }
    }
  }, [audioRef, track, initialTrackId]);

  // Effect to save current song and time to localStorage on unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current && track) {
        localStorage.setItem("lastPlayedSongId", track.id.toString());
        localStorage.setItem(
          "lastPlayedSongTime",
          audioRef.current.currentTime.toString()
        );
      }
      // Save user data on unload
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userProfilePicture", userData.profilePicture);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [audioRef, track, userData]); // Depend on userData to save latest changes

  const addToQueue = (song) => {
    setCurrentPlaylist((prev) => [...prev, song]);
    if (isShuffleOn) {
      setShuffledPlaylist((prev) => [...prev, song]);
    }
  };

  const removeFromQueue = (songId) => {
    setCurrentPlaylist((prev) => prev.filter((s) => s.id !== songId));
    if (isShuffleOn) {
      setShuffledPlaylist((prev) => prev.filter((s) => s.id !== songId));
    }
  };

  const reorderQueue = (newOrder) => {
    setCurrentPlaylist(newOrder);
    if (isShuffleOn) {
      setShuffledPlaylist(newOrder);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      const playAudio = async () => {
        try {
          if (playStatus) {
            await audioRef.current.play();
            setPlayStatus(true);
          }
        } catch (err) {
          console.log("Auto-play prevented:", err);
          setPlayStatus(false);
        }
      };
      playAudio();
    }
  }, [track, playStatus]);

  const toggleLoop = () => {
    setIsLoopOn(!isLoopOn);
    if (audioRef.current) {
      audioRef.current.loop = !isLoopOn;
    }
  };

  const toggleShuffle = (albumSongs = null) => {
    if (!isShuffleOn) {
      const playlistToShuffle = albumSongs || songsData;
      const shuffled = [...playlistToShuffle];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledPlaylist(shuffled);
      setCurrentPlaylist(shuffled);
    } else {
      setCurrentPlaylist(
        currentAlbumSongs.length > 0 && currentAlbumId !== null
          ? currentAlbumSongs
          : songsData
      );
    }
    setIsShuffleOn(!isShuffleOn);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = (id, albumSongs = null, albumId = null) => {
    const selectedTrack = songsData.find((song) => song.id === id);
    setTrack(selectedTrack);

    if (albumSongs && albumId !== null) {
      setCurrentAlbumSongs(albumSongs);
      setCurrentAlbumId(albumId);
      if (isShuffleOn) {
        const shuffled = [...albumSongs];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setShuffledPlaylist(shuffled);
        setCurrentPlaylist(shuffled);
      } else {
        setCurrentPlaylist(albumSongs);
      }
    } else {
      setCurrentAlbumSongs(songsData);
      setCurrentAlbumId(null);
      if (!isShuffleOn) {
        setCurrentPlaylist(songsData);
      }
    }
    setPlayStatus(true);
  };

  const previous = async () => {
    let prevTrack;
    const playlistToNavigate = isShuffleOn ? shuffledPlaylist : currentPlaylist;
    const currentIndex = playlistToNavigate.findIndex(
      (song) => song.id === track.id
    );
    if (currentIndex > 0) {
      prevTrack = playlistToNavigate[currentIndex - 1];
    } else if (isLoopOn) {
      prevTrack = playlistToNavigate[playlistToNavigate.length - 1];
    } else {
      return;
    }
    await setTrack(prevTrack);
    await audioRef.current.play();
    setPlayStatus(true);
  };

  const next = useCallback(async () => {
    let nextTrack;
    const playlistToNavigate = isShuffleOn ? shuffledPlaylist : currentPlaylist;
    const currentIndex = playlistToNavigate.findIndex(
      (song) => song.id === track.id
    );
    if (currentIndex < playlistToNavigate.length - 1) {
      nextTrack = playlistToNavigate[currentIndex + 1];
    } else if (isLoopOn) {
      nextTrack = playlistToNavigate[0];
    } else {
      return;
    }
    await setTrack(nextTrack);
    await audioRef.current.play();
    setPlayStatus(true);
  }, [isShuffleOn, shuffledPlaylist, currentPlaylist, track, isLoopOn]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (isLoopOn) {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isLoopOn, track, next]);

  const seekSong = async (e) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current.duration;
  };

  useEffect(() => {
    setTimeout(() => {
      audioRef.current.ontimeupdate = () => {
        seekBar.current.style.width =
          Math.floor(
            (audioRef.current.currentTime / audioRef.current.duration) * 100
          ) + "%";
        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      };
    }, 1000);
  }, [audioRef]);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    volume,
    handleVolumeChange,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    isShuffleOn,
    toggleShuffle,
    isLoopOn,
    toggleLoop,
    setCurrentPlaylist,
    currentPlaylist,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    currentAlbumSongs,
    currentAlbumId,
    globalSearchQuery,
    setGlobalSearchQuery,
    userData, // Expose userData
    setUserData, // Expose setUserData for updating
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
