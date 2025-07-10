"use client";
import { useState, useEffect } from "react";
import { RefreshCw, SettingsIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Send } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

export default function Subcategory({ id }) {
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/subcategory/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setValue(data.value);
            setLabel(data.label);
            setSlug(data.slug);
            setIsActive(Boolean(data.isActive)); // Ensure isActive is a boolean
            if (data.bannerUrl) setBannerPreview(data.bannerUrl);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleSlugGenerate = () => {
    if (value) {
      setSlug(value.trim().toLowerCase().replace(/\s+/g, "-"));
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleStatusChange = () => setIsActive(!isActive);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("value", value);
    formData.append("label", label);
    formData.append("slug", slug);
    formData.append("isActive", isActive);
    if (banner) formData.append("bannerUrl", banner);

    try {
      const res = id
        ? await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/update/subcategory/${id}`,
            {
              method: "PUT",
              body: formData,
            }
          )
        : await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/create/subcategories`,
            {
              method: "POST",
              body: formData,
            }
          );

      const data = await res.json();
      if (res.ok) {
        alert("✅ Subcategory saved successfully!");
        setValue("");
        setLabel("");
        setSlug("");
        setBanner(null);
        setBannerPreview(null);
        setIsActive(true);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 w-full bg-white shadow-lg rounded-xl mt-4 md:mt-6">
      <h1 className="text-xl font-semibold mb-6 text-center text-gray-800">
        {id ? "Edit" : "Add"} Subcategory
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <Input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              placeholder="Enter Value"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <Input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
               placeholder="Enter Label"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <div className="relative">
              <Input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Generated slug from value"
              />
              <button
                type="button"
                onClick={handleSlugGenerate}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex items-center h-[42px]">
  <label className="inline-flex items-center cursor-pointer space-x-2">
    <Checkbox
      checked={isActive}
      onCheckedChange={handleStatusChange}
      className="h-4 w-4" 
    />
    <span className="text-sm text-gray-700">
      {isActive ? "Active" : "Inactive"}
    </span>
  </label>
</div>

          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banner Image
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
             
            />
          </div>
          {bannerPreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
              <img
                src={bannerPreview}
                alt="Banner Preview"
                className="h-32 w-32 rounded-lg border shadow-sm"
              />
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span className="ml-2">Publishing...</span>
              </div>
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Publish Subcategory
              </>
            )}
          </button>
          {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
        </div>
      </form>
    </div>
  );
}
