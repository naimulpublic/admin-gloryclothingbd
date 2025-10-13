"use client";

import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Loader } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { toast } from "react-toastify";
import RoutePath from "@/custom/routepath/RoutePath";
import SubmitButton from "@/custom/submit/Submit";
import ImageUpload from "@/custom/image/Single";
import { CInput } from "@/custom/input/Input";

const SliderForm = ({ id }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchSlider = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/slider/${id}`
        );
        const data = await res.json();
        if (res.ok) {
          setName(data.name || "");
          setPreviewImage(data.imageUrl || null);
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
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/slider/${id}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/slider`,
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
        {id ? "Edit" : "Create New"} Slider
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
          <ImageUpload image={image} setImage={setImage} />
        </section>
        <SubmitButton isLoading={loading} id={id} name="Slider" />
      </form>
    </div>
  );
};

export default SliderForm;
