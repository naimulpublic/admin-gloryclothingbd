import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

const ImageDropzone = ({ onDrop, multiple = false }) => {
  const handleDrop = useCallback((acceptedFiles) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': []
    },
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className="border-dashed hover:bg-gray-100 border-2 border-gray-400 p-6 text-center cursor-pointer rounded-lg"
    >
      <Upload className="w-6 h-6 mx-auto" />
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here...</p>
      ) : (
        <p>Drag & drop image here, or click to select</p>
      )}
    </div>
  );
};

export default ImageDropzone;
