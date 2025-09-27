"use client";
import { useRef } from "react";
import {  ImagePlus } from "lucide-react";
import { Trash2 } from "lucide-react";

export default function ImageUpload({ image, setImage }) {
  const inputRef = useRef();

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file); // parent state update
    }
  };

  const handleRemove = () => {
    setImage(null); // parent এ reset হবে
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <label className="relative w-20 h-20 lg:w-24 lg:h-24 p-1 rounded-lg overflow-hidden border-dashed border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:border-orange-500">
      {image ? (
        <>
          <img
            src={typeof image === "string" ? image : URL.createObjectURL(image)}
            alt="preview"
            className="w-full h-full object-cover rounded-sm"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="cursor-pointer absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </>
      ) : (
        <ImagePlus size={40} className="text-gray-400" />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
}
