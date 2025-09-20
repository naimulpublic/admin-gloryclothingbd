"use client";

import React, { useState, useEffect } from "react";
import { RefreshCcw, X } from "lucide-react";

import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";


import { ImagePlus } from "lucide-react";


import { CInput } from "@/custom/input/Input";
import { CInputArea } from "@/custom/input/InputArea";
import { SUbCategoryMultiSelect } from "@/custom/multi-select/CategoryMultiSelect";
import SubmitButton from "@/custom/submit/Submit";
import { toast } from "sonner";

export default function CreateCategory({ subcategories, id }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [status, setStatus] = useState(false);
  const [subcategory, setSubcategory] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/category/${id}`
          );
          const data = await res.json();

          setName(data.name || "Category Name");
          setSlug(data.slug || "category-slug");
          setMetaTitle(data.metaTitle || "Meta Title");
          setMetaDescription(data.metaDescription || "Meta Description");
          setPriority(data.priority || 0);
          setStatus(data.status === "active" ? "active" : "inactive");

          if (data.subcategories) {
            setSubcategory(data.subcategories);
          }

          if (data.image) {
            setImagePreview(data.image);
          }

          if (data.banner) {
            setBannerPreview(data.banner);
          }
        } catch (err) {
          console.error("Error fetching category:", err);
        }
      };

      fetchCategory();
    }
  }, [id, subcategories]);

  const generateSlug = () => {
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-&]/g, "")
      .replace(/'/g, "")
      .replace(/&/g, "and")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    setSlug(generatedSlug);
  };

  // Handle changes in selected subcategories
  const handleSubcategoryChange = (selectedOptions) => {
    setSelectedSubcategories(selectedOptions || []);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const removeBanner = () => {
    setBanner(null);
    setBannerPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("priority", priority.toString());
      formData.append("status", status);

      if (image) formData.append("image", image);
      if (banner) formData.append("banner", banner);

      formData.append("subcategories", JSON.stringify(subcategory));

      const url = id
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/category/${id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/categories`;

      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success(`${id ? "Category updated" : "Category created"} successfully!`);

      setIsLoading(false);
    } catch (error) {
      console.error("Form submit error:", error);
      alert(error.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  const subcategoryOptions = subcategories.map((sub) => ({
    id: sub._id,
    name: sub.name,
    slug: sub.slug,
    banner: sub.banner,
    subchild: sub.subchild,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 mb-20">
      <h2 className=" text-sm md:text-lg font-medium text-center border py-1 lg:py-1.5 rounded-xs select-none bg-green-100 border-green-300">
        {id ? "Edit" : "Create New"} Category
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
        <div>
          <CInput
            label={
              <div>
                Name <span className="text-red-500">*</span>
              </div>
            }
            id="categoryName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="relative">
          <CInput
            label={
              <div>
                Ganarate Slug <span className="text-red-500">*</span>
              </div>
            }
            type="text"
            id="categorySlug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <button
            type="button"
            onClick={generateSlug}
            className="transition-transform active:scale-90 cursor-pointer absolute top-[1px] right-[1px] bg-orange-500 text-white rounded-r-[9px] px-2 py-[9px]"
          >
            <RefreshCcw size={20} />
          </button>
        </div>

        <div>
          <CInput
            required={false}
            label={
              <div>
                Meta Title <span>*</span>
              </div>
            }
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            id="metaTitle"
          />
        </div>

        <div>
          <CInputArea
            required={false}
            label={
              <div>
                Meta Description <span>*</span>
              </div>
            }
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            id="metaDescription"
          />
        </div>

        <div>
          <CInput
            label={
              <div>
                Priority <span className="text-red-500">*</span>
              </div>
            }
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
          />
        </div>

        {/* Status */}
        <div className="flex items-center space-x-1">
          <Checkbox
            className="cursor-pointer size-5"
            id="status"
            checked={status === "active"}
            onCheckedChange={(checked) =>
              setStatus(checked ? "active" : "inactive")
            }
          />
          <Label>
            {status === "active" ? "Active Category" : "Inactive Category"}
          </Label>
        </div>

        <div className="md:col-span-2">
          <SUbCategoryMultiSelect
            options={subcategoryOptions}
            value={subcategory}
            onChange={setSubcategory}
            placeholder="Select Subcategories"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="shadow-green-300 text-center mb-2 block text-sm font-bold pb-1 shadow-xs">
            Category Image
          </label>
          <label className="relative w-16 h-16 md:w-24 md:h-24 p-1 rounded-lg overflow-hidden border-dashed border border-gray-300 flex items-center justify-center cursor-pointer hover:border-orange-500">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="category-preview"
                  className="w-full h-full rounded-sm"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4 cursor-pointer" />
                </button>
              </>
            ) : (
              <ImagePlus
                strokeWidth={1.5}
                size={40}
                className="text-gray-500"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Banner Upload */}
        <div className="border-l pl-2">
          <label className="shadow-green-300 text-center mb-2 block text-sm font-bold pb-1 shadow-xs">
            Category Banner
          </label>
          <label className="relative w-28 h-16 md:w-40 md:h-24 p-1 rounded-lg overflow-hidden border-dashed border border-gray-300 flex items-center justify-center cursor-pointer hover:border-orange-500">
            {bannerPreview ? (
              <>
                <img
                  src={bannerPreview}
                  alt="banner-preview"
                  className="w-full h-full rounded-sm"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBanner();
                  }}
                  className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4 cursor-pointer" />
                </button>
              </>
            ) : (
              <ImagePlus
                strokeWidth={1.5}
                size={40}
                className="text-gray-500"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <SubmitButton id={id} isLoading={isLoading} name="Category" />
    </form>
  );
}
