// FileName: /Navbar.jsx
import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { globalSearchQuery, setGlobalSearchQuery, userData } =
    useContext(PlayerContext); // Consume userData

  const isAlbumPage = location.pathname.startsWith("/album/");
  const isArtistPage = location.pathname.startsWith("/artist/");
  const isProfilePage = location.pathname.startsWith("/profile");

  const handleSearchChange = (e) => {
    setGlobalSearchQuery(e.target.value);
    if (window.location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold">
        <div className="flex items-center gap-2">
          <img
            onClick={() => navigate(-1)}
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            src={assets.arrow_left}
            alt=""
          />
          <img
            onClick={() => navigate(1)}
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            src={assets.arrow_right}
            alt=""
          />
        </div>
        {/* Conditional rendering for Search Input */}
        {!(isAlbumPage || isArtistPage || isProfilePage) && (
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative w-40 sm:w-64">
              <input
                type="text"
                placeholder="Search songs or albums..."
                className="w-full bg-[#2a2a2a] text-white rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none"
                value={globalSearchQuery}
                onChange={handleSearchChange}
              />
              <img
                className="w-5 absolute left-3 top-1/2 -translate-y-1/2"
                src={assets.search_icon}
                alt="Search"
              />
            </div>
            <img
              src={userData.profilePicture} // Use userData.profilePicture
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => navigate("/profile")}
              alt="Profile"
            ></img>
          </div>
        )}
        {(isAlbumPage || isArtistPage || isProfilePage) && (
          <div className="flex items-center gap-4">
            <img
              src={userData.profilePicture} // Use userData.profilePicture
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => navigate("/profile")}
              alt="Profile"
            ></img>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
