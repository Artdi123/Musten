import React from "react";
import { useNavigate } from "react-router-dom";

const ArtistAboutModal = ({ artist, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen || !artist) return null;

  const handleArtistNameClick = () => {
    navigate(`/artist/${artist.id}`);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#1f1e1e] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">About the Artist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
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

          <div className="text-gray-300 leading-relaxed">
            <p>{artist.desc || "No description available for this artist."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistAboutModal;
