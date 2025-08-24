import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import DisplayHome from "./DisplayHome.jsx";
import DisplayAlbum from "./DisplayAlbum.jsx";
import DisplayArtist from "./DisplayArtist.jsx";
import DisplayProfile from "./DisplayProfile.jsx";
import { albumsData } from "../assets/assets.js";

const Display = ({ showRightSidebar = false }) => {
  const displayRef = useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");
  const isArtist = location.pathname.includes("artist");
  const isProfile = location.pathname.includes("profile"); 

  let bgColor = "#121212"; // Default background color

  if (isAlbum) {
    const albumId = location.pathname.slice(-1);
    const album = albumsData[Number(albumId)];
    if (album) {
      bgColor = album.bgColor;
    }
  } else if (isArtist) {
    // const artistId = location.pathname.slice(-1);
    // const artist = artistData.find(a => a.id.toString() === artistId);
    // if (artist && artist.bgColor) {
    //     bgColor = artist.bgColor;
    // }
  } else if (isProfile) {
    // Set a specific background for the profile page if desired
    bgColor = "#1A1A1A"; 
  }

  useEffect(() => {
    if (isAlbum) {
      displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`;
    } else {
      displayRef.current.style.background = `#121212`;
    }
  }, [isAlbum, bgColor]);

  return (
    <div
      ref={displayRef}
      className={`m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto flex-1 ${
        showRightSidebar 
          ? "" 
          : ""
      }`}
    >
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
        <Route path="/artist/:id" element={<DisplayArtist />} />
        <Route path="/profile" element={<DisplayProfile />} />
      </Routes>
    </div>
  );
};

export default Display;
