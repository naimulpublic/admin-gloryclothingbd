"use client";

import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

const SliderForm = ({ id }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [isActive, setIsActive] = useState(true); // true for active, false for inactive
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchSlider = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/slider/${id}`
        );
        const data = await res.json();
        if (res.ok) {
          setName(data.name || "");
          setPreviewImage(data.imageUrl || null);
          setIsActive(data.isActive); // Ensure `data.isActive` is a boolean
        }
      } catch {
        alert("Something went wrong.");
      }
    };
    fetchSlider();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || (!image && !previewImage)) {
      alert("All fields are required.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("isActive", isActive); // Send isActive as boolean
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch(
        id
          ? `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/update/slider/${id}`
          : `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/create/slider`,
        {
          method: id ? "PUT" : "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Slider uploaded successfully.");
        setName("");
        setImage(null);
        setPreviewImage(null);
      } else {
        alert(data.message);
      }
    } catch {
      console.log("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        {id ? "Update Slider" : "Upload New Slider"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-3">
            <label className="block font-medium">
              Slider Name <span className="text-red-600">*</span>
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="flex items-center flex-1 cursor-pointer mt-2">
            <Checkbox
              className="h-5 w-5 cursor-pointer"
              checked={isActive}  // Ensure this reflects the state
              onCheckedChange={(checked) => setIsActive(checked)}  // Correctly set the state when toggled
            />
            <span className="ml-2 ">{isActive ? "Active" : "Inactive"}</span>
          </div>
        </div>

        <section className="flex items-center">
          <div className="w-[60%]">
            <Input type="file" onChange={handleImageChange} />
          </div>
          <div className="w-[40%] flex items-center justify-center">
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-3 h-24 rounded object-cover border"
              />
            )}
          </div>
        </section>
        <Button type="submit" disabled={loading}>
          {loading
            ? id
              ? "Updating..."
              : "Uploading..."
            : id
            ? "Update"
            : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default SliderForm;
