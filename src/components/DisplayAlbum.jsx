// FileName: /DisplayAlbum.jsx
import React, { useContext, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import {
  albumsData,
  assets,
  songsData,
  projectsekaiSongs,
  jpopSongs,
} from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const DisplayAlbum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const albumData = albumsData.find((album) => album.id.toString() === id);
  const {
    track,
    playStatus,
    play,
    pause,
    playWithId,
    isShuffleOn,
    toggleShuffle,
    setCurrentPlaylist,
    setGlobalSearchQuery, // Import setGlobalSearchQuery
    userData,
  } = useContext(PlayerContext);
  const [isPlayingAlbum, setIsPlayingAlbum] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  // Clear global search query when entering an album page
  useEffect(() => {
    setGlobalSearchQuery("");
  }, [id, setGlobalSearchQuery]); // Dependency on 'id' to re-run if album changes, and setGlobalSearchQuery

  // Function to determine which album a song actually belongs to
  const getSongAlbum = (song) => {
    if (song.album) {
      return song.album;
    }
    
    // Check if song has "Hatsune Miku" as a singer
    if (song.singer && song.singer.includes("Hatsune Miku")) {
      return "Hatsune Miku Album";
    }
    
    // Check if song has "Hatsune Miku" in the artist field
    if (song.artist && song.artist.includes("Hatsune Miku")) {
      return "Hatsune Miku Album";
    }
    
    if (song.artist === "Camellia") {
      return "Camellia Album";
    }
      else if (song.artist === "XI") {
        return "XI Album";
    } else if (song.artist === "t+pazolite") {
      return "t+pazolite Album";
    } else if (projectsekaiSongs.some(ps => ps.id === song.id)) {
      return "Project Sekai Song Album";
    } else if (jpopSongs.some(js => js.id === song.id)) {
      return "Jpop & Other Album";
    } else {
      return "Liked Song";
    }
  };

  // ... (rest of the component remains the same)
  // Filter songs based on album ID
  const albumSongs = React.useMemo(() => {
    if (id === "1") {
      return songsData.filter(
        (song) => song.artist && song.artist.includes("Camellia")
      );
    } else if (id === "2") {
      return songsData.filter(
        (song) => song.artist && song.artist.includes("XI")
      );
    } else if (id === "3") {
      return songsData.filter(
        (song) => song.artist && song.artist.includes("t+pazolite")
      );
    } else if (id === "4") {
      return songsData.filter(
        (song) =>
          (song.artist && song.artist.includes("Hatsune Miku")) ||
          (song.singer && song.singer.includes("Hatsune Miku"))
      );
    } else if (id === "5") {
      return projectsekaiSongs;
    } else if (id === "6") {
      return jpopSongs;
    } else {
      return songsData;
    }
  }, [id]);

  // Sort songs based on selected option
  const sortSongs = useCallback(
    (songs) => {
      switch (sortBy) {
        case "title":
          return [...songs].sort((a, b) => a.name.localeCompare(b.name));
        case "artist":
          return [...songs].sort((a, b) => {
            const artistA = a.artist || "";
            const artistB = b.artist || "";
            return artistA.localeCompare(artistB);
          });
        case "album":
          return [...songs].sort((a, b) => {
            const albumA = getSongAlbum(a) || "";
            const albumB = getSongAlbum(b) || "";
            return albumA.localeCompare(albumB);
          });
        default:
          return songs; // Default order (as they appear in the array)
      }
    },
    [sortBy]
  );

  // Filter and sort songs based on search query and sort option
  useEffect(() => {
    let result = albumSongs;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      result = result.filter(
        (song) =>
          song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (song.artist &&
            song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    result = sortSongs(result);

    setFilteredSongs(result);
  }, [searchQuery, albumSongs, sortBy, sortSongs]);

  const calculateTotalDuration = () => {
    let totalSeconds = 0;
    const songsToCalculate = searchQuery
      ? filteredSongs
      : sortSongs(albumSongs);

    songsToCalculate.forEach((song) => {
      const [minutes, seconds] = song.duration.split(":").map(Number);
      totalSeconds += minutes * 60 + seconds;
    });

    const hours = Math.floor(totalSeconds / 3600);
    const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hr ${remainingMinutes} min`;
    }
    return `${remainingMinutes} min`;
  };

  // Album-specific play/pause toggle
  const togglePlayPause = useCallback(() => {
    const songsToUse = searchQuery ? filteredSongs : sortSongs(albumSongs);
    if (songsToUse.length === 0) return;

    if (playStatus && isPlayingAlbum) {
      pause();
      setIsPlayingAlbum(false);
    } else {
      // When playing from the album, set the current playlist to the album's songs
      // But only if shuffle is off, otherwise let playWithId handle it
      if (!isShuffleOn) {
        setCurrentPlaylist(songsToUse);
      }
      if (!songsToUse.some((song) => song.id === track?.id)) {
        playWithId(songsToUse[0].id, songsToUse, albumData.id);
      } else {
        play();
      }
      setIsPlayingAlbum(true);
    }
  }, [
    albumSongs,
    playStatus,
    isPlayingAlbum,
    track,
    play,
    pause,
    playWithId,
    filteredSongs,
    searchQuery,
    setCurrentPlaylist,
    albumData.id,
    sortSongs,
    isShuffleOn,
  ]);

  // Update current playlist when albumSongs or filteredSongs change
  useEffect(() => {
    const songsToUse = searchQuery ? filteredSongs : sortSongs(albumSongs);
    // Only update the playlist if shuffle is off, otherwise let playWithId handle it
    if (!isShuffleOn) {
      setCurrentPlaylist(songsToUse);
    }
  }, [
    albumSongs,
    filteredSongs,
    searchQuery,
    setCurrentPlaylist,
    sortBy,
    sortSongs,
    isShuffleOn,
  ]);

  // Toggle sort options dropdown
  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };

  // Handle sort selection
  const handleSort = (type) => {
    setSortBy(type);
    setShowSortOptions(false);
  };

  return (
    <>
      <Navbar />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img className="w-48 rounded" src={albumData.image} alt="" />
        <div className="flex flex-col">
          <p> Playlist </p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">
            {albumData.name}
          </h2>
          <h4>{albumData.desc}</h4>
          <p className="mt-3">
            <img
              className="inline-block w-8 h-8 rounded-full cursor-pointer"
              src={userData.profilePicture} // Use userData.profilePicture
              alt=""
              onClick={() => navigate("/profile")}
            />
            <b
              className="ml-3 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/profile")}
            >
              {userData.name} 
            </b>{" "}
            •
            <b className="font-normal">
              {" "}
              {
                (searchQuery ? filteredSongs : sortSongs(albumSongs)).length
              }{" "}
              Songs,{" "}
            </b>
            {calculateTotalDuration()}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlayPause}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-3 py-3 flex items-center gap-2"
          >
            {playStatus && isPlayingAlbum ? (
              <img
                src={assets.pause_icon}
                className="w-5 h-5"
                alt="Pause"
                title="Pause"
              />
            ) : (
              <img
                src={assets.play_icon}
                className="w-5 h-5"
                alt="Play"
                title="Play"
              />
            )}
          </button>
          <button
            onClick={() =>
              toggleShuffle(searchQuery ? filteredSongs : sortSongs(albumSongs))
            }
            className={`bg-transparent border border-gray-500 hover:border-white text-white rounded-full px-3 py-3 flex items-center gap-2 cursor-pointer sm:px-6 ${
              isShuffleOn ? "opacity-100" : "opacity-50"
            }`}
            title={isShuffleOn ? "Shuffle is on" : "Shuffle is off"}
          >
            <img className="w-5" src={assets.shuffle_icon} alt="Shuffle" />
            <span className="font-bold hidden sm:block">Shuffle</span>
          </button>
        </div>

        {/* Search input and List icons on the right */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search in album..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#ffffff26] text-white rounded-full pl-4 pr-10 py-2 focus:outline-none w-48 md:w-64"
            />
            <img
              src={assets.search_icon}
              className="w-5 h-5 absolute right-3 top-2.5 flex"
              alt="Search"
            />
          </div>
          <div className="relative">
            <button
              onClick={toggleSortOptions}
              className="text-gray-400 hover:text-white p-2 relative"
            >
              <img
                src={assets.list_icon}
                className="w-5 h-5"
                alt="Sort"
                title="Sort options"
              />
            </button>
            {showSortOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-[#282828] rounded shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleSort("default")}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#383838] ${
                      sortBy === "default" ? "text-blue-500" : "text-white"
                    }`}
                  >
                    Default order
                  </button>
                  <button
                    onClick={() => handleSort("title")}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#383838] ${
                      sortBy === "title" ? "text-blue-500" : "text-white"
                    }`}
                  >
                    Sort by title
                  </button>
                  <button
                    onClick={() => handleSort("artist")}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#383838] ${
                      sortBy === "artist" ? "text-blue-500" : "text-white"
                    }`}
                  >
                    Sort by artist
                  </button>
                  <button
                    onClick={() => handleSort("album")}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#383838] ${
                      sortBy === "album" ? "text-blue-500" : "text-white"
                    }`}
                  >
                    Sort by album
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b>Title
        </p>
        <p>Album</p>
        <img className="m-auto w-4" src={assets.clock_icon} alt="" />
      </div>
      <hr />
      {(searchQuery ? filteredSongs : sortSongs(albumSongs)).map(
        (item, index) => (
          <div
            onClick={() => playWithId(item.id, albumSongs, albumData.id)}
            key={index}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 items-center text-[#a7a7a7] text-sm hover:bg-[#ffffff26] cursor-pointer"
          >
            <div className="flex items-center">
              <b className="mr-4 text-[#a7a7a7] w-4">{index + 1}</b>
              <img className="w-10 h-10 mr-3 rounded" src={item.image} alt="" />
              <div className="w-52 truncate">
                <p className="text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-400 truncate">{item.artist}</p>
              </div>
            </div>
            <p className="text-[15px]">{getSongAlbum(item)}</p>
            <p className="text-[15px] text-center">{item.duration}</p>
          </div>
        )
      )}
      {searchQuery && filteredSongs.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No songs found matching "{searchQuery}"
        </div>
      )}
    </>
  );
};

export default DisplayAlbum;
