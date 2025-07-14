"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { RefreshCcw } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CreativeCommons } from "lucide-react";
import { NetworkIcon } from "lucide-react";
import { SquarePlus } from "lucide-react";
import RoutePath from "../dashboardlayout/clients/RoutePath";
import { Checkbox } from "../ui/checkbox";
import { Loader } from "lucide-react";

// react-select ডাইনামিকভাবে লোড করা
const Select = dynamic(() => import("react-select"), { ssr: false });

export default function CategoryForm({ subcategories, id }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [status, setStatus] = useState(true);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryBanner, setCategoryBanner] = useState(null);
  const [categoryBannerPreview, setCategoryBannerPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  

  // Load existing category data if editing an existing category
  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/category/${id}`
          );
          const data = await res.json();

          console.log(data);

          // Static data filling
          setName(data.name || "Category Name");
          setSlug(data.slug || "category-slug");
          setMetaTitle(data.metaTitle || "Meta Title");
          setMetaDescription(data.metaDescription || "Meta Description");
          setPriority(data.priority || 0);
          setStatus(data.status === "active" ? "active" : "inactive");

          if (data.image) {
            setImagePreview(data.image); // URL preview
          }

          if (data.banner) {
            setCategoryBannerPreview(data.banner);
          }
        } catch (err) {
          console.error("Error fetching category:", err);
        }
      };

      fetchCategory();
    }
  }, [id]);

  // Generate slug from category name
  const generateSlug = () => {
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-&]/g, "");
    setSlug(generatedSlug);
  };

  // Handle changes in selected subcategories
  const handleSubcategoryChange = (selectedOptions) => {
    setSelectedSubcategories(selectedOptions || []);
  };

  // Handle image drop

  const handleImageDrop = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle banner drop
  const handleBannerDrop = (e) => {
    const file = e.target.files[0];
    setCategoryBanner(file);
    setCategoryBannerPreview(URL.createObjectURL(file));
  };

  // Handle form submission
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
      if (categoryBanner) formData.append("banner", categoryBanner);

      formData.append(
        "subcategories",
        JSON.stringify(
          selectedSubcategories.map((sub) => ({
            _id: sub._id,
            value: sub.value,
            label: sub.label,
            slug: sub.slug,
            isActive: sub.isActive,
            bannerUrl: sub.bannerUrl,
            createdAt: sub.createdAt,
            imagePublicId: sub.imagePublicId,
          }))
        )
      );

      const url = id
        ? `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/update/category/${id}`
        : `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/create/categories`;

      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      alert(`${id ? "Category updated" : "Category created"} successfully!`);
    } catch (error) {
      console.error("Form submit error:", error);
      alert(error.message || "Something went wrong");
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className=" px-6">
        <RoutePath />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
        <h2 className=" text-xl font-semibold mt-6 mb-8 text-center border py-1.5 rounded-sm select-none bg-black text-white border-orange-600">
          {id ? "Update" : "Create New"} Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                id="floating_outlined"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="floating_outlined"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Enter Category Name <span className="text-red-500">*</span>
              </label>
            </div>
          </div>

          {/* Slug */}
          <div className="relative">
            <div className="relative">
              <input
                id="floating_outlined45"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="floating_outlined45"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Genarate Slug <span className="text-red-500">*</span>{" "}
              </label>
            </div>

            <button
              type="button"
              onClick={generateSlug}
              className="p-2.5 bg-orange-500 rounded-r-[9px] absolute top-[1px] right-[1px] hover:bg-orange-600 cursor-pointer"
            >
              <RefreshCcw className="text-white" size={20} />
            </button>
          </div>

          {/* Meta Title */}
          <div>
            <div className="relative">
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                id="floating_outlinedmeta"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="floating_outlinedmeta"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Enter Meta Title
              </label>
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <div className="relative">
              <textarea
                type="text"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={1}
                id="floating_outlinedmetadec"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="floating_outlinedmetadec"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Enter Meta Decprition
              </label>
            </div>
          </div>

          {/* Priority */}
          <div>
            <div className="relative">
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                id="floating_priority"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="floating_priority"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Enter Category Priority <span className="text-red-500">*</span>
              </label>
            </div>
          </div>

          {/* Status */}
          <div className="flex gap-2 mt-1">
            <Checkbox
              className="cursor-pointer h-5 w-5"
              checked={status}
              onCheckedChange={(checked) => setStatus(checked === true)}
            />
            <p>{status ? "Active Category" : "Deactive Category"}</p>
          </div>

          {/* Subcategories */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2 p-2 border-b">
              Select Subcategories <span className="text-red-500">*</span>
            </label>
            <Select
              isMulti
              options={subcategories}
              value={selectedSubcategories}
              onChange={handleSubcategoryChange}
              placeholder="Select Subcategories"
              className="w-full"
              getOptionLabel={(e) => e.label}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1 p-2 border-b">
              Select Category Image <span className="text-red-500">*</span>
            </label>
            <Input
              
              type="file"
              accept="image/*"
              onChange={handleImageDrop}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Category"
                className="w-14 h-16 rounded-md border m-2"
              />
            )}
          </div>

          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-medium mb-1 p-2 border-b">
              Select Category Banner <span className="text-red-500">*</span>
            </label>
            <Input type="file" onChange={handleBannerDrop} />
            {categoryBannerPreview && (
              <img
                src={categoryBannerPreview}
                alt="Banner"
                className="w-36 h-16 rounded-md border m-2"
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className=" bg-black text-white border border-red-600 px-4 rounded-sm  py-2 text-lg font-semibold cursor-pointer flex items-center gap-2">
          {isLoading ? (
            <>
              <Loader strokeWidth={3} className="h-6 w-6  animate-spin" />
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
    </>
  );
}
