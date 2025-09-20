"use client";

import { useState, useEffect } from "react";
import { RefreshCcw, X, ImagePlus } from "lucide-react";

import { toast } from "sonner";
import RoutePath from "@/custom/routepath/RoutePath";
import { CInput } from "@/custom/input/Input";
import { MultiSelect } from "@/custom/multi-select/MultiSelect";
import SubmitButton from "@/custom/submit/Submit";
import { ChevronDown } from "lucide-react";

export default function Subcategory({ id, subcategorydata }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [banner, setBanner] = useState(null);
  const [subchild, setSubchild] = useState([]);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/subcategory/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setName(data.name || "");
            setSlug(data.slug || "");
            setSubchild(data.subchild || []);
            if (data.banner) setBannerPreview(data.banner); // Banner preview ঠিক মতো সেট হবে
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

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

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const removeBanner = () => {
    setBanner(null);
    setBannerPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    if (banner) formData.append("banner", banner);
    formData.append("subchild", JSON.stringify(subchild));

    try {
      const res = id
        ? await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/subcategory/${id}`,
            { method: "PUT", body: formData }
          )
        : await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/subcategory`,
            { method: "POST", body: formData }
          );

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        if (!id) {
          setName("");
          setSlug("");
          setBanner(null);
          setBannerPreview(null);
          setSubchild([]);
        }
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error occurred.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RoutePath />
      <div className="p-4 md:p-6">
        <h2 className=" text-sm md:text-lg font-medium text-center border py-1 lg:py-1.5 rounded-xs select-none bg-green-100 border-green-300">
          {id ? "Edit" : "Create New"} Subcategory
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Slug */}
          <div className="sm:flex gap-2 w-full mt-4">
            <div className="sm:w-1/2">
              <CInput
                label={
                  <div>
                    Name <span className="text-red-500">*</span>
                  </div>
                }
                proudctId={id}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="Enter_Value"
              />
            </div>
            <div className="sm:w-1/2 mt-2 sm:mt-0">
              <div className="relative">
                <CInput
                  label={
                    <div>
                      Generate Slug <span className="text-red-500">*</span>
                    </div>
                  }
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  id="categorySlug"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="transition-transform active:scale-90 cursor-pointer absolute top-[.8px] right-[1px] bg-orange-500 text-white rounded-r-[9px] px-2 py-[9px]"
                >
                  <RefreshCcw size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-[30%]">
              <label className=" block text-xs lg:text-sm font-medium mb-2 shadow-green-300 px-2 shadow-xs pb-1">
                Upload Banner Image <span className="text-red-500">*</span>
              </label>
              <label className="relative w-20 h-20  lg:w-24 lg:h-24 p-1 rounded-lg overflow-hidden border-dashed border border-gray-300 flex items-center justify-center cursor-pointer hover:border-orange-500">
                {bannerPreview ? (
                  <>
                    <img
                      src={bannerPreview}
                      alt="category-preview"
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
                  <ImagePlus size={24} className="text-gray-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="w-[70%]">
              <div className="w-full">
                <MultiSelect
                  options={subcategorydata.map((item) => ({
                    name: item.name,
                    slug: item.slug,
                  }))}
                  selected={subchild}
                  onChange={setSubchild}
                  placeholder={
                    <div className="flex items-center relative w-full">
                      <div className="">
                        Select Subcategories
                        <span>*</span>
                      </div>
                      <ChevronDown className="w-4 h-4 absolute right-0" />
                    </div>
                  }
                />
              </div>
            </div>
          </div>

          <div className="px-2">
            {message && (
              <div className="flex justify-start mt-3 text-sm text-red-600 font-semibold">
                <p>{message}</p>
              </div>
            )}

            <SubmitButton isLoading={loading} id={id} name="Subcategory" />
          </div>
        </form>
      </div>
    </>
  );
}
