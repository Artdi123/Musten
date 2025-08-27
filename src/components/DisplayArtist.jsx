// ... (existing imports)
import React, { useContext, useCallback, useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import {
  assets,
  artistData,
  songsData,
  projectsekaiSongs,
  jpopSongs,
} from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const DisplayArtist = () => {
  const { id } = useParams();
  const artistInfo = artistData.find((artist) => artist.id.toString() === id);
  const {
    track,
    playStatus,
    play,
    pause,
    playWithId,
    isShuffleOn,
    toggleShuffle,
    setCurrentPlaylist,
    setGlobalSearchQuery,
  } = useContext(PlayerContext);

  const [isPlayingArtist, setIsPlayingArtist] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    setGlobalSearchQuery("");
  }, [id, setGlobalSearchQuery]);

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
    } else if (projectsekaiSongs.some((ps) => ps.id === song.id)) {
      return "Project Sekai Song Album";
    } else if (jpopSongs.some((js) => js.id === song.id)) {
      return "Jpop & Other Album";
    } else {
      return "Liked Song";
    }
  };

  const artistSongs = React.useMemo(() => {
    if (!artistInfo) return [];
    return songsData.filter(
      (song) =>
        song.artist &&
        song.artist.split(",").some((a) => a.trim() === artistInfo.name)
    );
  }, [artistInfo]);

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
          return songs;
      }
    },
    [sortBy]
  );

  useEffect(() => {
    let result = artistSongs;

    if (searchQuery.trim() !== "") {
      result = result.filter(
        (song) =>
          song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (song.artist &&
            song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    result = sortSongs(result);

    setFilteredSongs(result);
  }, [searchQuery, artistSongs, sortBy, sortSongs]);

  const calculateTotalDuration = () => {
    let totalSeconds = 0;
    const songsToCalculate = searchQuery
      ? filteredSongs
      : sortSongs(artistSongs);

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

  const togglePlayPause = useCallback(() => {
    const songsToUse = searchQuery ? filteredSongs : sortSongs(artistSongs);
    if (songsToUse.length === 0) return;

    if (playStatus && isPlayingArtist) {
      pause();
      setIsPlayingArtist(false);
    } else {
      setCurrentPlaylist(songsToUse);
      if (!songsToUse.some((song) => song.id === track?.id)) {
        playWithId(songsToUse[0].id, songsToUse, null);
      } else {
        play();
      }
      setIsPlayingArtist(true);
    }
  }, [
    artistSongs,
    playStatus,
    isPlayingArtist,
    track,
    play,
    pause,
    playWithId,
    filteredSongs,
    searchQuery,
    setCurrentPlaylist,
    sortSongs,
  ]);

  useEffect(() => {
    const songsToUse = searchQuery ? filteredSongs : sortSongs(artistSongs);
    setCurrentPlaylist(songsToUse);
  }, [
    artistSongs,
    filteredSongs,
    searchQuery,
    setCurrentPlaylist,
    sortBy,
    sortSongs,
  ]);

  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };

  const handleSort = (type) => {
    setSortBy(type);
    setShowSortOptions(false);
  };

  if (!artistInfo) {
    return (
      <>
        <Navbar />
        <div className="text-white text-center py-10">Artist not found.</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mt-10 flex gap-4 md:gap-8 flex-col md:flex-row md:items-end">
        <div className="flex items-center justify-center sm:justify-start">
          <img
            className="w-48 h-48 rounded-full object-cover"
            src={artistInfo.profile}
            alt={artistInfo.name}
          />
        </div>
        <div className="flex flex-col">
          <p> Artist </p>
          <h2 className="text-3xl font-bold mb-4 md:text-6xl">
            {artistInfo.name}
          </h2>
          <h4>{artistInfo.Listener}</h4>
          <p className="mt-3">
            <b className="font-normal">
              {" "}
              • <b></b>
              {
                (searchQuery ? filteredSongs : sortSongs(artistSongs)).length
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
            {playStatus && isPlayingArtist ? (
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
              toggleShuffle(
                searchQuery ? filteredSongs : sortSongs(artistSongs)
              )
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

        <div className="flex items-center gap-4">
          <div className="relative w-32 sm:w-64">
            <input
              type="text"
              placeholder="Search in artist's songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#ffffff26] text-white rounded-full pl-4 pr-10 py-2 focus:outline-none w-full"
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

      <div className="grid grid-cols-1 sm:grid-cols-3 mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b>Title
        </p>
        <p className="hidden sm:block">Album</p>
        <img
          className="hidden sm:block m-auto w-4"
          src={assets.clock_icon}
          alt=""
        />
      </div>
      <hr />
      {(searchQuery ? filteredSongs : sortSongs(artistSongs)).map(
        (item, index) => (
          <div
            onClick={() => playWithId(item.id, artistSongs, null)}
            key={index}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-2 items-center text-[#a7a7a7] text-sm hover:bg-[#ffffff26] cursor-pointer"
          >
            <div className="flex items-center w-full gap-2 min-w-0">
              <b className="mr-2 sm:mr-4 text-[#a7a7a7] w-4 flex-shrink-0 text-center">
                {index + 1}
              </b>
              <img
                className="w-10 h-10 sm:w-12 sm:h-12 mr-2 sm:mr-3 rounded object-cover flex-shrink-0"
                src={item.image}
                alt=""
              />
              <div className="flex-1 min-w-0">
                <p className="text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-400 truncate">{item.artist}</p>
              </div>
            </div>
            <p className="hidden sm:block text-[15px] truncate">
              {getSongAlbum(item)}
            </p>
            <p className="hidden sm:block text-[15px] text-center">
              {item.duration}
            </p>
          </div>
        )
      )}
      {searchQuery && filteredSongs.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No songs found matching "{searchQuery}" by {artistInfo.name}
        </div>
      )}

      {/* About the Artist Section */}
      <h2 className="text-2xl font-bold mb-4 mt-10">About</h2>
      <div className="mb-10 p-6 bg-[#1f1e1e] rounded-lg w-full md:w-[900px]">
        <div className="flex items-center mb-4">
          <img
            src={artistInfo.profile}
            alt={artistInfo.name}
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover mr-4"
          />
        </div>
        <div>
          <p className="text-lg font-semibold mt-2">{artistInfo.Listener}</p>
        </div>
        <p className="text-gray-300 leading-relaxed mt-2">
          {artistInfo.desc || "No description available for this artist."}
        </p>
      </div>
    </>
  );
};

export default DisplayArtist;
