import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Player from "./components/Player.jsx";
import Display from "./components/Display.jsx";
import View from "./components/View.jsx";
import Queue from "./components/Queue.jsx";
import Landing from "./components/Landing.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { PlayerContext } from "./context/PlayerContext";

const App = () => {
  const {
    audioRef,
    track,
    currentPlaylist,
    playWithId,
    currentAlbumSongs,
    currentAlbumId,
    setUserData,
  } = useContext(PlayerContext);
  const [showView, setShowView] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        setUserData({
          name: user.name,
          profilePicture: user.profilePicture
        });
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();

    // Listen for storage changes (when user logs in/registers)
    const handleStorageChange = (e) => {
      if (e.key === 'currentUser') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setUserData]);

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="h-[90%] flex flex-1 overflow-hidden">
        <Sidebar />
        <Display showRightSidebar={showView || showQueue} />
        {/* Right Sidebar for View and Queue */}
        {(showView || showQueue) && (
          <div className="w-[20%] bg-[#121212] border-l border-gray-800">
            {showView && <View />}
            {showQueue && (
              <Queue
                currentPlaylist={currentPlaylist}
                track={track}
                playWithId={playWithId}
                currentAlbumSongs={currentAlbumSongs}
                currentAlbumId={currentAlbumId}
              />
            )}
          </div>
        )}
      </div>
      <Player
        showView={showView}
        setShowView={setShowView}
        showQueue={showQueue}
        setShowQueue={setShowQueue}
      />
      <audio ref={audioRef} src={track.file} preload="auto"></audio>
    </div>
  );
};

export default App;
