"use client";

import ImageUpload from "@/custom/image/Single";
import { CInput } from "@/custom/input/Input";
import RoutePath from "@/custom/routepath/RoutePath";
import SubmitButton from "@/custom/submit/Submit";
import { smallUrl } from "@/static/smallutils/Utils";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";


export default function CreateShpopImage({ id }){
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchSlider = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/shopnowimage/${id}`
        );
        const data = await res.json();
        if (res.ok) {
          setName(data.name || "");
          setPreviewImage(`${smallUrl}${data.publicId}`);
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

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch(
        id
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/shopnowimage/${id}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/shopnowimage`,
        {
          method: id ? "PUT" : "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success(`Slider ${id ? "updated" : "created"} successfully.`);
        setName("");
        setImage(null);
        setPreviewImage(null);
      } else {
        toast.error(data.message);
      }
    } catch {
      alert("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white px-4 ">
      <RoutePath />
      <h2 className="mt-2 md:mt-4 text-sm md:text-lg font-medium text-center border py-1 lg:py-1.5 rounded-xs select-none bg-green-100 border-green-300">
        {id ? "Edit" : "Create New"} Shop Now Image
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2 mt-2">
          <div className="flex-3">
            <CInput
              label={
                <div>
                  <span className="text-sm font-medium">Slider Name</span>
                  <span className="text-xs text-red-600">*</span>
                </div>
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <section className="flex items-center">
          <ImageUpload
            previewImage={previewImage}
            image={image}
            setImage={setImage}
          />
        </section>
        <SubmitButton isLoading={loading} id={id} name="Shop Now Image" />
      </form>
    </div>
  );
};


