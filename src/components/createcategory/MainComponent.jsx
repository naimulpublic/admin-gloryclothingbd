"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { RefreshCcw } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CreativeCommons } from "lucide-react";
import { NetworkIcon } from "lucide-react";
import { SquarePlus } from "lucide-react";

// react-select ডাইনামিকভাবে লোড করা
const Select = dynamic(() => import("react-select"), { ssr: false });

export default function CategoryForm({ subcategories, id }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [status, setStatus] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryBanner, setCategoryBanner] = useState(null);
  const [categoryBannerPreview, setCategoryBannerPreview] = useState(null);

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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Slug */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Slug</label>
          <div className="flex">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full border rounded-l-md px-3 py-2"
            />
            <button
              type="button"
              onClick={generateSlug}
              className="bg-gray-100 border rounded-r-md px-3 py-2 hover:bg-gray-200"
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>

        {/* Meta Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Meta Title</label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Meta Description
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Subcategories */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Subcategories
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
          <label className="text-sm font-medium mb-1">Image</label>
          <Input type="file" accept="image/*" onChange={handleImageDrop} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Category"
              className="w-32 h-32 rounded-md"
            />
          )}
        </div>

        {/* Banner Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Category Banner
          </label>
          <Input type="file" onChange={handleBannerDrop} />
          {categoryBannerPreview && (
            <img
              src={categoryBannerPreview}
              alt="Banner"
              className="mt-2 w-32 h-32 object-cover rounded-md"
            />
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit">
        {id ? (
          "Update Category"
        ) : (
          <div className="flex gap-2 items-center cursor-pointer">
            <SquarePlus />
            <p> Create Category</p>
          </div>
        )}
      </Button>
    </form>
  );
}
