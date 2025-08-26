import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import {
  albumsData,
  songsData,
  projectsekaiSongs,
  jpopSongs,
  artistData,
} from "../assets/assets";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import SearchListItem from "./SearchListItem";
import { PlayerContext } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";

const DisplayHome = () => {
  const { globalSearchQuery } = useContext(PlayerContext); // Consume userData
  const [randomSongs, setRandomSongs] = useState([]);
  const [randomArtists, setRandomArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const shuffledSongs = [...songsData].sort(() => 0.5 - Math.random());
    setRandomSongs(shuffledSongs.slice(0, 15));

    const shuffledArtists = [...artistData].sort(() => 0.5 - Math.random());
    setRandomArtists(shuffledArtists.slice(0, 8));
  }, []);

  const filteredAlbums = albumsData.filter(
    (album) =>
      album.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      album.desc.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  const filteredSongs = songsData.filter(
    (song) =>
      song.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      (song.artist &&
        song.artist.toLowerCase().includes(globalSearchQuery.toLowerCase()))
  );

  const filteredArtists = artistData.filter((artist) =>
    artist.name.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      {globalSearchQuery.length > 0 ? (
        <>
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">
              Search Results for "{globalSearchQuery}"
            </h1>
            {filteredArtists.length > 0 && (
              <>
                <h2 className="my-3 font-bold text-xl">Artists</h2>
                <div className="flex flex-col gap-2">
                  {filteredArtists.map((item, index) => (
                    <SearchListItem key={index} item={item} type="artist" />
                  ))}
                </div>
              </>
            )}

            {filteredAlbums.length > 0 && (
              <>
                <h2 className="my-3 font-bold text-xl">Albums</h2>
                <div className="flex flex-col gap-2">
                  {filteredAlbums.map((item, index) => (
                    <SearchListItem key={index} item={item} type="album" />
                  ))}
                </div>
              </>
            )}

            {filteredSongs.length > 0 && (
              <>
                <h2 className="my-3 font-bold text-xl">Songs</h2>
                <div className="flex flex-col gap-2">
                  {filteredSongs.map((item, index) => (
                    <SearchListItem key={index} item={item} type="song" />
                  ))}
                </div>
              </>
            )}

            {filteredAlbums.length === 0 &&
              filteredSongs.length === 0 &&
              filteredArtists.length === 0 && (
                <p className="text-gray-400 mt-4">
                  No results found for "{globalSearchQuery}"
                </p>
              )}
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Albums</h1>
            <div className="flex overflow-auto">
              {albumsData.map((item, index) => (
                <AlbumItem
                  key={index}
                  name={item.name}
                  desc={item.desc}
                  id={item.id}
                  image={item.image}
                  songsData={
                    item.id === 1
                      ? songsData.filter(
                          (song) =>
                            song.artist && song.artist.includes("Camellia")
                        )
                      : item.id === 2
                      ? songsData.filter(
                          (song) => song.artist && song.artist.includes("XI")
                        )
                      : item.id === 3
                      ? songsData.filter(
                          (song) =>
                            song.artist && song.artist.includes("t+pazolite")
                        )
                      : item.id === 4
                      ? songsData.filter(
                          (song) =>
                            (song.artist &&
                              song.artist.includes("Hatsune Miku")) ||
                            (song.singer &&
                              song.singer.includes("Hatsune Miku"))
                        )
                      : item.id === 5
                      ? projectsekaiSongs
                      : item.id === 6
                      ? jpopSongs
                      : songsData
                  }
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Recommended Artists</h1>
            <div className="flex overflow-x-auto gap-4 pb-4">
              {randomArtists.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start flex-shrink-0"
                >
                  <img
                    src={item.profile}
                    alt={item.name}
                    onClick={() => navigate(`/artist/${item.id}`)}
                    className="w-36 h-36 rounded-full object-cover mb-2 cursor-pointer"
                  />
                  <p
                    className="font-medium hover:underline cursor-pointer"
                    onClick={() => navigate(`/artist/${item.id}`)}
                  >
                    {item.name}
                  </p>
                  <p className="font-normal text-gray-300">Artist</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Recommended Songs</h1>
            <div className="flex overflow-auto">
              {randomSongs.map((item, index) => (
                <SongItem
                  key={index}
                  name={item.name}
                  artist={item.artist}
                  id={item.id}
                  image={item.image}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DisplayHome;
