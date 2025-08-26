import React, { useContext, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Player from "./components/Player.jsx";
import Display from "./components/Display.jsx";
import View from "./components/View.jsx";
import Queue from "./components/Queue.jsx";
import { PlayerContext } from "./context/PlayerContext";

const App = () => {
  const {
    audioRef,
    track,
    currentPlaylist,
    playWithId,
    currentAlbumSongs,
    currentAlbumId,
  } = useContext(PlayerContext);
  const [showView, setShowView] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

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
