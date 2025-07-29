// /components/EditProfileModal.jsx
import React, { useState, useEffect } from "react";

const EditProfileModal = ({
  isOpen,
  onClose,
  currentName,
  currentProfilePicture,
  onSave,
}) => {
  const [name, setName] = useState(currentName);
  const [profilePicture, setProfilePicture] = useState(currentProfilePicture);
  const [newProfilePictureFile, setNewProfilePictureFile] = useState(null);

  useEffect(() => {
    setName(currentName);
    setProfilePicture(currentProfilePicture);
    setNewProfilePictureFile(null); // Reset file input on modal open
  }, [isOpen, currentName, currentProfilePicture]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePictureFile(file);
      setProfilePicture(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleSave = () => {
    onSave(name, newProfilePictureFile || currentProfilePicture); // Pass file or current URL
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#282828] p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl"
        >
          &times;
        </button>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={profilePicture}
            alt="Profile Preview"
            className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-gray-600"
          />
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Name Input */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-gray-300 text-sm font-bold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-[#3a3a3a] border-gray-600 text-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
