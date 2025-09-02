// FileName: /Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { globalSearchQuery, setGlobalSearchQuery, userData } =
    useContext(PlayerContext); // Consume userData

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const isAlbumPage = location.pathname.startsWith("/album/");
  const isArtistPage = location.pathname.startsWith("/artist/");
  const isProfilePage = location.pathname.startsWith("/profile");

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('currentUser') !== null;

  const handleSearchChange = (e) => {
    setGlobalSearchQuery(e.target.value);
    if (window.location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.reload(); // Reload to reset the app state
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            <div className="relative w-32 sm:w-64">
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
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <img
                  src={userData.profilePicture} // Use userData.profilePicture
                  className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={toggleProfileDropdown}
                  alt="Profile"
                />
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#282828] rounded-md shadow-lg z-50 border border-gray-700">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setShowProfileDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#383838] transition-colors"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#383838] transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        )}
        {(isAlbumPage || isArtistPage || isProfilePage) && (
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <img
                  src={userData.profilePicture} // Use userData.profilePicture
                  className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={toggleProfileDropdown}
                  alt="Profile"
                />
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#282828] rounded-md shadow-lg z-50 border border-gray-700">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setShowProfileDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#383838] transition-colors"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#383838] transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
