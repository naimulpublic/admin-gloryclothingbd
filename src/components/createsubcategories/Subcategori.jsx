"use client";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";

import RoutePath from "../dashboardlayout/clients/RoutePath";
import { RefreshCcw } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { Loader } from "lucide-react";
import { SubcategoryMultiSelect } from "../custom/MultiSelect";

export default function Subcategory({ id, subChild }) {
  const [value, setValue] = useState("");
  const [slug, setSlug] = useState("");
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectsubchild, setSelectsubchild] = useState([]);
  const options = subChild || [];

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/subcategory/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setValue(data.value);
            setSlug(data.slug);
            setSelectsubchild(data.subChild || []);

            if (data.bannerUrl) setBannerPreview(data.bannerUrl);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleSlugGenerate = () => {
    if (value) {
      const slug = value
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(slug);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    const filteredSubChild = selectsubchild.map((item) => ({
      name: item.name,
      slug: item.slug,
    }));

    formData.append("subChild", JSON.stringify(filteredSubChild));
    formData.append("value", value);
    formData.append("slug", slug);

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
        alert(`✅ Subcategory ${id ? "Updated" : "Created"} Successfully!`);
        setValue("");
        setSlug("");
        setSelectsubchild([]);
        setBanner(null);
        setBannerPreview(null);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="px-8 ">
        <RoutePath />
      </div>
      <div className="px-8 pb-40 py-4 w-full bg-white shadow-lg rounded-xl">
        <h1 className="text-xl font-semibold mb-4 text-center border py-1.5 rounded-sm select-none bg-black text-white border-orange-600">
          {id ? "Edit" : "Create New"} Subcategory
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-x-2">
              <div className="relative">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                  id="floating_name"
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="floating_name"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Enter Subcategory Name <span className="text-red-500">*</span>
                </label>
              </div>
            </div>
            <div className="relative">
              <div className="relative">
                <input
                  id="floating_slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="floating_slug"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Genarate Slug <span className="text-red-500">*</span>{" "}
                </label>
              </div>

              <button
                type="button"
                onClick={handleSlugGenerate}
                className="p-2.5 bg-orange-500 rounded-r-[9px] absolute top-[1px] right-[1px] hover:bg-orange-600 cursor-pointer"
              >
                <RefreshCcw className="text-white" size={20} />
              </button>
            </div>
          </div>

          <div>
            <SubcategoryMultiSelect
              options={options}
              selected={selectsubchild}
              onChange={setSelectsubchild}
              placeholder="Select subchild"
            />
          </div>

          <div className="flex gap-2">
            <div className=" w-1/2">
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
              <div className=" w-1/2">
                <p className="text-sm text-gray-600 border-b pb-1 font-medium">
                  Image Preview..
                </p>
                <img
                  src={bannerPreview}
                  alt="Banner Preview"
                  className="h-16 w-32 rounded-xs border-sm shadow-sm m-1"
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className=" bg-black text-white border border-red-600 px-4 rounded-sm  py-2 text-md font-semibold cursor-pointer flex items-center gap-2"
            >
              {loading ? (
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

            {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
          </div>
        </form>
      </div>
    </>
  );
}
