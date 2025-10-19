"use client";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { RefreshCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import RoutePath from "@/custom/routepath/RoutePath";
import SubmitButton from "@/custom/submit/Submit";
import ImageUpload from "@/custom/image/Single";
import { toast } from "react-toastify";
import { mediumUrl } from "@/static/smallutils/Utils";

export default function Brand({ id }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [status, setStatus] = useState("active");
  const [brandIcon, setBrandIcon] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchBrand = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/brand/${id}`
          );
          const data = await response.json();
          setName(data.name);
          setSlug(data.slug);
          setIsFeatured(data.isFeatured);
          setStatus(data.status);         
          setPreviewUrl(`${mediumUrl}${data.imagePublicId}`);
        } catch (error) {
          console.error("Error fetching brand:", error);
        }
      };

      fetchBrand();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("isFeatured", isFeatured);
    formData.append("status", status);
    if (brandIcon) {
      formData.append("brandIcon", brandIcon);
    } else if (id) {
      formData.append("brandIcon", previewUrl);
    }

    try {
      const method = id ? "PUT" : "POST";
      const url = id
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/brand/${id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/brand`;

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Something went wrong!");
      }

      const result = await res.json();
      toast.success("Brand created successfully!");

      setName("");
      setSlug("");
      setIsFeatured(false);
      setStatus("active");
      setBrandIcon(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create brand.");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-&]/g, "");
    setSlug(generatedSlug);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrandIcon(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 space-y-2">
      <RoutePath />
      <h2 className="mt-6 text-sm md:text-lg font-medium text-center border py-1 lg:py-1.5 rounded-xs select-none bg-green-100 border-green-300">
        {id ? "Edit" : "Create New"} Brand
      </h2>

      <div className="md:flex gap-2 mt-4">
        <div className="md:w-1/2 mb-2 md:mb-0">
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
              Enter Name <span className="text-red-500">*</span>
            </label>
          </div>
        </div>

        <div className="relative md:w-1/2">
          <div className="relative">
            <input
              required
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              id="floating_slug"
              className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="floating_slug"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Generate Slug <span className="text-red-500">*</span>
            </label>
          </div>

          <button
            type="button"
            onClick={generateSlug}
            className="p-2.5 bg-orange-500 rounded-r-[9px] absolute top-0 right-0  hover:bg-orange-600 cursor-pointer"
          >
            <RefreshCcw className="text-white" size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="w-1/2">
          <Label className="p-2">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full border p-2 rounded-md">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 w-1/2 mt-4">
          <Checkbox
            id="isFeatured"
            className="h-5 w-5 cursor-pointer"
            checked={isFeatured}
            onCheckedChange={setIsFeatured}
          />
          <Label htmlFor="isFeatured">
            {isFeatured ? "Featured" : "Not Featured"}
          </Label>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ImageUpload
          previewImage={previewUrl}
          image={brandIcon}
          setImage={setBrandIcon}
        />
      </div>

      <SubmitButton id={id} isLoading={loading} name="Brand" />
    </form>
  );
}
