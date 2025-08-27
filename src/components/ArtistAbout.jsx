// src/components/MobileArtistAbout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const MobileArtistAbout = ({ artist, onClose }) => {
  const navigate = useNavigate();

  if (!artist) return null;

  const handleArtistNameClick = () => {
    navigate(`/artist/${artist.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black z-[60] flex flex-col">
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 py-6">
        <button
          onClick={onClose}
          className="absolute left-4 text-white text-2xl font-bold"
        >
          ×
        </button>
        <div className="text-center">
          <h1 className="text-white text-lg font-semibold">About the Artist</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 text-white">
        <div className="flex flex-col items-center mb-6">
          <img
            src={artist.profile}
            alt={artist.name}
            className="w-48 h-48 rounded-full object-cover mb-4"
          />
          <h3
            className="text-2xl font-bold text-white cursor-pointer hover:underline"
            onClick={handleArtistNameClick}
          >
            {artist.name}
          </h3>
          {artist.Listener && (
            <p className="text-lg text-gray-300 mt-2">{artist.Listener}</p>
          )}
        </div>

        <div className="text-gray-300 leading-relaxed text-center">
          <p>{artist.desc || "No description available for this artist."}</p>
        </div>
      </div>
    </div>
  );
};

export default MobileArtistAbout;
