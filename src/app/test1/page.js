"use client";

import React, { useState } from "react";
import { UploadCloud, X } from "lucide-react";

export default function ImageUploadPreview() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 border border-dashed border-gray-400 rounded-lg w-72 mx-auto">
      {selectedImage ? (
        <div className="relative w-40 h-40 rounded overflow-hidden border border-gray-300">
          <img
            src={selectedImage}
            alt="Preview"
            className="object-cover w-full h-full"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          htmlFor="imageUpload"
          className="cursor-pointer flex flex-col items-center justify-center bg-blue-50 text-blue-600 p-4 rounded-md hover:bg-blue-100 transition"
        >
          <UploadCloud size={32} />
          <span className="mt-2 text-sm font-medium">Click to Upload</span>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
