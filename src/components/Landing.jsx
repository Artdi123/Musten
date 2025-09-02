import React from 'react';
import { useNavigate } from 'react-router-dom';
import { albumsData, songsData, artistData } from '../assets/assets';

const Landing = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <img src="/App Logo.png" className='w-12 h-12' alt="Musten App Logo" />
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-full"
          >
            Register
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <h2 className="text-5xl font-bold mb-4">Discover Your Music</h2>
        <p className="text-xl text-gray-400 mb-8">Stream Hundreds of Japanese and EDM Songs</p>
        <button
          onClick={handleClick}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold"
        >
          Get Started
        </button>
      </div>

      {/* Featured Albums */}
      <div className="px-4 py-10">
        <h3 className="text-2xl font-bold mb-6">Featured Albums</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {albumsData.slice(0, 6).map((album) => (
            <div
              key={album.id}
              onClick={handleClick}
              className="cursor-pointer hover:bg-[#2a2a2a] p-4 rounded-lg transition-colors"
            >
              <img
                src={album.image}
                alt={album.name}
                className="w-full aspect-square object-cover rounded-lg mb-2"
              />
              <h4 className="font-semibold truncate">{album.name}</h4>
              <p className="text-sm text-gray-400 truncate">{album.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Artists */}
      <div className="px-4 py-10">
        <h3 className="text-2xl font-bold mb-6">Featured Artists</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {artistData.slice(0, 6).map((artist) => (
            <div
              key={artist.id}
              onClick={handleClick}
              className="cursor-pointer hover:bg-[#2a2a2a] p-4 rounded-lg transition-colors text-center"
            >
              <img
                src={artist.profile}
                alt={artist.name}
                className="w-full aspect-square object-cover rounded-full mb-2"
              />
              <h4 className="font-semibold truncate">{artist.name}</h4>
              <p className="text-sm text-gray-400">Artist</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Songs */}
      <div className="px-4 py-10">
        <h3 className="text-2xl font-bold mb-6">Popular Songs</h3>
        <div className="space-y-2">
          {songsData.slice(0, 5).map((song, index) => (
            <div
              key={song.id}
              onClick={handleClick}
              className="flex items-center gap-4 cursor-pointer hover:bg-[#2a2a2a] p-3 rounded-lg transition-colors"
            >
              <span className="text-gray-400 w-6 text-center">{index + 1}</span>
              <img
                src={song.image}
                alt={song.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{song.name}</h4>
                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
              </div>
              <span className="text-sm text-gray-400">{song.duration}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-10 px-4 border-t border-gray-800">
        <p className="text-gray-400">© 2025 Musten. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Landing;
