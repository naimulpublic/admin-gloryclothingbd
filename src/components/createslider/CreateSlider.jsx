"use client";

import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import RoutePath from "../dashboardlayout/clients/RoutePath";
import { Loader } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { toast } from "sonner";
import { revalidateSliders } from "@/utils/Revalidate";

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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/slider/${id}`
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
    formData.append("isActive", isActive);
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
        await revalidateSliders();
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
    <div className="w-full bg-white px-4 rounded shadow pb-52">
      <RoutePath />
      <h1 className="text-xl font-semibold mb-4 mt-6 text-center border py-1.5 rounded-sm select-none bg-black text-white border-orange-600">
        {id ? "Edit" : "Create New"} Slider
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-3">
            <div className="relative">
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="floating_name"
                className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="floating_name"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Enter Slider Name <span className="text-red-600">*</span>
              </label>
            </div>
          </div>
          <div className="flex flex-1 items-center cursor-pointer">
            <Checkbox
              className="h-5 w-5 cursor-pointer"
              checked={isActive} // Ensure this reflects the state
              onCheckedChange={(checked) => setIsActive(checked)} // Correctly set the state when toggled
            />
            <span className="ml-2 font-medium">
              {isActive ? "Slider Active" : " Slider Inactive"}
            </span>
          </div>
        </div>

        <section className="flex items-center">
          <div className="w-[60%] flex flex-col">
            <label className="text-sm font-medium p-2 border-b text-gray-900 mb-1">
              Upload Slider Image
            </label>
            <Input type="file" onChange={handleImageChange} />
          </div>
          <div className="w-[40%] flex items-center justify-center">
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="h-16 w-32 rounded-sm border-sm"
              />
            )}
          </div>
        </section>
        <button
          className=" bg-black text-white border border-red-600 px-4 rounded-sm  py-2 text-md font-medium cursor-pointer flex items-center gap-2"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader strokeWidth={2} className="h-6 w-6  animate-spin" />
              PROCESSING...
            </>
          ) : id ? (
            "UPDATE PRODUCT"
          ) : (
            <>
              <SquarePlus className="h-5 w-5" />
              PUBLISH CATEGORY
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SliderForm;
