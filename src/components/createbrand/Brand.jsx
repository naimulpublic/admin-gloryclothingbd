"use client";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Brand({ id }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState("active");
  const [brandIcon, setBrandIcon] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchBrand = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/brand/${id}`
          );
          const data = await response.json();
          setName(data.name);
          setSlug(data.slug);
          setIsFeatured(data.isFeatured);
          setStatus(data.status);
          setBrandIcon(data.brandIcon);
          setPreviewUrl(data.brandIcon);
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
    }

    try {
      const method = id ? "PUT" : "POST";
      const url = id
        ? `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/update/brand/${id}`
        : `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/create/brand`;

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Something went wrong!");
      }

      const result = await res.json();
      alert("Brand created successfully!");

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
    <form onSubmit={handleSubmit} className="p-6 space-y-2">
      <h2 className="rounded-md font-medium text-center text-xl p-2 border-b">
        Create New Brand
      </h2>

      <div className="flex gap-2">
        <div className="w-1/2">
          <Label className="p-2">
            Enter Brand Name <span className="text-red-500">*</span>
          </Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="relative w-1/2">
          <Label className="p-2">
            Generate Slug <span className="text-red-500">*</span>
          </Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          <button
            type="button"
            onClick={generateSlug}
            className="absolute top-[30px] p-2 cursor-pointer hover:text-blue-500 right-2"
          >
            <RefreshCcw size={20} />
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
        <div className="w-1/2">
          <Label className="p-2">
            Brand Icon <span className="text-red-500">*</span>
          </Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        {previewUrl && (
          <div className="flex items-center mt-6">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-16 w-16 rounded-md object-cover border"
            />
          </div>
        )}
      </div>

      <Button type="submit" className="bg-black text-white cursor-pointer" disabled={loading}>
        {loading ? "Processing..." : id ? "UpdateBrand" : "CreateBrand"}
      </Button>
    </form>
  );
}
