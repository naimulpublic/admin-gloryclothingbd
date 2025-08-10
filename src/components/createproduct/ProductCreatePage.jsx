"use client";

import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { RefreshCcw } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import RoutePath from "../dashboardlayout/clients/RoutePath";
import { X } from "lucide-react";
import { Loader } from "lucide-react";
import { productSizes } from "@/static/ProductSize";
import { UploadCloud } from "lucide-react";
import { MultiSelect } from "../custom/MultiSelect";
import { revalidateProducts } from "@/utils/Revalidate";
import { toast } from "sonner";

export default function ProductForm({
  id,
  brandData = [],
  categoriesData = [],
  subcategori = [],
  subChild,
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [defaultColor, setDefaultColor] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [subcategory, setSubcategory] = useState([]);
  const [specification, setSpecification] = useState([{ key: "", value: "" }]);
  const [highLight, setHighLight] = useState([{ key: "", value: "" }]);
  const [boxContent, setBoxContent] = useState([{ key: "", value: "" }]);
  const [tags, setTags] = useState([]);
  const [selectsubchild, setSelectsubchild] = useState([]);
  const [measurementImage, setMeasurementImage] = useState(null);

  const [colorVariants, setColorVariants] = useState([
    {
      name: "",
      quantity: 0,
      size: [],
      images: [],
    },
  ]);
  const optionssubchild = subChild || [];

  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMeasurementImage(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchProducts = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/product/${id}`
          );

          if (res.ok) {
            const data = await res.json();

            // Basic fields
            setName(data.name || "");
            setSlug(data.slug || "");
            setMetaTitle(data.metaTitle || "");
            setMetaDescription(data.metaDescription || "");
            setPrice(data.price?.toString() || "");
            setMrp(data.mrp?.toString() || "");
            setBrand(data.brand || "");
            setDescription(data.description || "");
            setCategory(data.category || "");
            setCategorySlug(data.categorySlug || "");
            setDefaultColor(data.defaultColor || "");
            setIsFeatured(data.isFeatured || false);
            setMeasurementImage(data.measurementImage);

            if (data.measurementImage) {
              setPreviewUrl(data.measurementImage);
            }

            setSubcategory(
              Array.isArray(data.subcategory)
                ? data.subcategory.map((item) => ({
                    value: item.value || "",
                    slug: item.slug || "",
                  }))
                : []
            );
            setSelectsubchild(
              Array.isArray(data.subChild)
                ? data.subChild.map((item) => ({
                    name: item.name || "",
                    slug: item.slug || "",
                  }))
                : []
            );

            setSpecification(
              Array.isArray(data.specification)
                ? [...data.specification]
                : [{ key: "", value: "" }]
            );
            setHighLight(
              Array.isArray(data.highLight)
                ? [...data.highLight]
                : [{ key: "", value: "" }]
            );
            setBoxContent(
              Array.isArray(data.boxContent)
                ? [...data.boxContent]
                : [{ key: "", value: "" }]
            );
            setTags(Array.isArray(data.tags) ? [...data.tags] : []);

            const mappedVariants = Array.isArray(data.colorVariants)
              ? data.colorVariants.map((variant) => ({
                  name: variant.colorName || "",
                  quantity: variant.quantity || 0,
                  size: Array.isArray(variant.sizes) ? variant.sizes : [],
                  images: Array.isArray(variant.images)
                    ? variant.images.map((img) => ({
                        url: img.url || "",
                      }))
                    : [],
                }))
              : [
                  {
                    name: "",
                    quantity: 0,
                    size: [],
                    images: [],
                  },
                ];

            setColorVariants(mappedVariants);
          } else {
            console.error("Failed to fetch product");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };

      fetchProducts();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (subcategory.length === 0) {
      alert("Please select subcategory.");
      return;
    }
    if (colorVariants.length === 0) {
      alert("Please add at least one color variant.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    const filteredSubChild = selectsubchild.map((item) => ({
      name: item.name,
      slug: item.slug,
    }));
    formData.append("subChild", JSON.stringify(filteredSubChild));
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("price", price);
    formData.append("mrp", mrp);
    formData.append("brand", brand);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("categorySlug", categorySlug);
    formData.append("defaultColor", defaultColor);
    formData.append("isFeatured", isFeatured);
    formData.append("measurementImage", measurementImage);

    formData.append("subcategory", JSON.stringify(subcategory));
    formData.append("specification", JSON.stringify(specification));
    formData.append("highLight", JSON.stringify(highLight));
    formData.append("boxContent", JSON.stringify(boxContent));
    formData.append("tags", JSON.stringify(tags));

    colorVariants.forEach((variant, index) => {
      formData.append(`colors[${index}][colorName]`, variant.name);
      formData.append(`colors[${index}][quantity]`, variant.quantity);
      formData.append(`colors[${index}][sizes]`, variant.size.join(","));

      variant.images.forEach((file) => {
        formData.append(`colors[${index}][images]`, file);
      });
    });
    try {
      const url = id
        ? `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/update/product/${id}`
        : `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/create/product`;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        await revalidateProducts();
      } else {
        toast.error("Failed to submit product.");
      }
    } catch (error) {
      console.error("Error occurred while submitting product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorVariendSizes = (index, field, value) => {
    const updated = [...colorVariants];
    if (field === "size") {
      updated[index][field] = value.split(",").map((s) => s.trim());
    } else {
      updated[index][field] = value;
    }
    setColorVariants(updated);
  };

  const handleColorVariantChange = (index, field, value) => {
    const updated = [...colorVariants];
    updated[index][field] = value;

    if (field === "category") {
      updated[index]["size"] = []; // category পরিবর্তন হলে size reset হবে
    }

    setColorVariants(updated);
  };

  const handleSizeToggle = (index, size) => {
    const updated = [...colorVariants];
    const sizes = updated[index].size;

    if (sizes.includes(size)) {
      updated[index].size = sizes.filter((s) => s !== size);
    } else {
      updated[index].size = [...sizes, size];
    }

    setColorVariants(updated);
  };

  const handleImageChange = (index, files) => {
    const updated = [...colorVariants];
    updated[index].images = Array.from(files);
    setColorVariants(updated);
  };

  const addColorVariant = () => {
    setColorVariants([
      ...colorVariants,
      {
        name: "",
        quantity: 0,
        size: [],
        images: [],
      },
    ]);
  };

  const removeColorVariant = (index) => {
    const updated = [...colorVariants];
    updated.splice(index, 1);
    setColorVariants(updated);
  };

  const generateSlug = () => {
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-&]/g, "");
    setSlug(generatedSlug);
  };

  const options = subcategori.map((item) => ({
    id: item._id,
    value: item.value,
    label: item.value,
  }));

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 lg:space-y-8 w-full px-2 lg:px-6 bg-white rounded shadow overflow-x-hidden overflow-y-auto"
    >
      <RoutePath />
      <h2 className=" text-sm lg:text-xl font-medium lg:font-semibold my-2 lg:my-4 text-center border py-1 lg:py-1.5 rounded-sm select-none bg-black text-white border-orange-600">
        {id ? "Edit" : "Create New"} Product
      </h2>
      <div className="flex gap-1 lg:gap-2 pt-4">
        <div className="w-1/2">
          <div className="relative">
            <input
              id="floating_outlined1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              {...(!id ? { required: true } : {})}
            />
            <label
              htmlFor="floating_outlined1"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Enter Product Name <span className="text-red-500">*</span>{" "}
            </label>
          </div>
        </div>
        <div className="w-1/2 relative">
          <div className="relative">
            <input
              id="floating_outlined"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              type="text"
              className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              {...(!id ? { required: true } : {})}
            />
            <label
              htmlFor="floating_outlined"
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
      </div>
      <div className="flex gap-1 lg:gap-2">
        <div className="w-1/2">
          <div className="relative">
            <input
              id="floating_outlined3"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              type="text"
              className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="floating_outlined3"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Enter Meta Title
            </label>
          </div>
        </div>
        <div className="w-1/2">
          <div className="relative">
            <textarea
              rows="1"
              id="floating_outlined4"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              type="text"
              className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="floating_outlined4"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Enter Meta Discription
            </label>
          </div>
          <Label className="p-2"></Label>
        </div>
      </div>
      <div className="flex gap-1 lg:gap-2">
        <div className="w-1/2">
          <div className="relative">
            <input
              id="floating_outlined5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              {...(!id ? { required: true } : {})}
            />
            <label
              htmlFor="floating_outlined5"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Enter Product Price <span className="text-red-500">*</span>{" "}
            </label>
          </div>
        </div>
        <div className="w-1/2">
          <div className="relative">
            <input
              type="number"
              id="floating_outlined6"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              {...(!id ? { required: true } : {})}
            />
            <label
              htmlFor="floating_outlined6"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Enter Product MRP <span className="text-red-500">*</span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex gap-1 lg:gap-2">
        <div className="w-1/2">
          <div className="relative">
            <Select
              value={brand}
              onValueChange={(value) => setBrand(value)}
              id="floating_outlined6"
              type="text"
              className="outline-none block px-2.5 pb-3 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              {...(!id ? { required: true } : {})}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                {brandData.map((item) => (
                  <SelectItem key={item._id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label
              htmlFor="floating_outlined6"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Select Brand <span className="text-red-500">*</span>
            </label>
          </div>
        </div>

        <div className="w-1/2">
          <div className="relative">
            <textarea
              rows={1}
              id="floating_outlined7"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              {...(!id ? { required: true } : {})}
            />
            <label
              htmlFor="floating_outlined7"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Enter Product Description <span className="text-red-500">*</span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex gap-1 lg:gap-2">
        <div className="w-1/2">
          <div className="relative">
            <Select
              className="block px-2.5 pb-2 pt-3 "
              type="text"
              id="floating_outlined10"
              onValueChange={(value) => {
                const selectedCategory = categoriesData.find(
                  (cat) => cat.name === value
                );
                if (selectedCategory) {
                  setCategory(selectedCategory.name);
                  setCategorySlug(selectedCategory.slug);
                }
              }}
              value={category}
              {...(!id ? { required: true } : {})}
            >
              <SelectTrigger className="w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesData.map((item) => (
                  <SelectItem key={item._id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label
              htmlFor="floating_outlined10"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Select Product Category <span className="text-red-500">*</span>
            </label>
          </div>
        </div>

        <div className=" w-1/2">
          <Label className="py-3 px-2 rounded-sm  border-b mb-1">
            Enter Product Subcategory <span className="text-red-500">*</span>
          </Label>
          <MultiSelect
            options={subcategori.map((sub) => ({
              value: sub.value,
              slug: sub.slug,
            }))}
            selected={subcategory}
            onChange={setSubcategory}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex gap-1 lg:gap-2">
        <div className="w-1/2">
          <MultiSelect
            options={optionssubchild}
            selected={selectsubchild}
            onChange={setSelectsubchild}
            placeholder="Select subchild"
          />
        </div>

        <div className="w-1/2 flex items-center lg:gap-2">
          <div className="w-full">
            <div className="relative">
              <input
                id="floating_outlined20"
                value={defaultColor}
                onChange={(e) => setDefaultColor(e.target.value)}
                type="text"
                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                {...(!id ? { required: true } : {})}
              />
              <label
                htmlFor="floating_outlined20"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Enter Default Color <span className="text-red-500">*</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-xl mb-8 shadow text-center p-2 ">
          Porduct Specification!
        </h4>
        {specification.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <div className="flex flex-col w-full">
              <div className="relative">
                <input
                  id={`floating_outlined40_${index}`}
                  value={item.key}
                  onChange={(e) => {
                    const updated = [...specification];
                    updated[index].key = e.target.value;
                    setSpecification(updated); // Update the specification state
                  }}
                  type="text"
                  className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor={`floating_outlined40_${index}`}
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Enter Key <span className="text-red-500">*</span>{" "}
                </label>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <div className="relative">
                <input
                  id={`floating_outlined454_${index}`}
                  value={item.value}
                  onChange={(e) => {
                    const updated = [...specification];
                    updated[index].value = e.target.value;
                    setSpecification(updated); // Update the specification state
                  }}
                  type="text"
                  className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor={`floating_outlined454_${index}`}
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Enter Value <span className="text-red-500">*</span>{" "}
                </label>
              </div>
            </div>
            {specification.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  const updated = [...specification];
                  updated.splice(index, 1); // remove this item
                  setSpecification(updated);
                }}
                className="text-red-500 hover:text-red-700 font-bold text-xl px-2"
                title="Remove this field"
              >
                <X className="cursor-pointer" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={
            () => setSpecification([...specification, { key: "", value: "" }]) // Add a new specification field
          }
          className="text-sm hover:text-blue-500 cursor-pointer hover:underline"
        >
          Add Specification
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-xl mb-8 shadow text-center p-2">
          Product Highlight!
        </h4>
        {highLight.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <div className="flex flex-col w-full">
              <div className="relative">
                <input
                  id={`floating_outlined547${index}`}
                  value={item.key}
                  onChange={(e) => {
                    const updated = [...highLight];
                    updated[index].key = e.target.value;
                    setHighLight(updated);
                  }}
                  type="text"
                  className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor={`floating_outlined547${index}`}
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Enter Key <span className="text-red-500">*</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <div className="relative">
                <input
                  id={`floating${index}`}
                  value={item.value}
                  onChange={(e) => {
                    const updated = [...highLight];
                    updated[index].value = e.target.value;
                    setHighLight(updated);
                  }}
                  type="text"
                  className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor={`floating${index}`}
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Enter Value <span className="text-red-500">*</span>
                </label>
              </div>
            </div>
            {highLight.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  const updated = [...highLight];
                  updated.splice(index, 1); // remove this item
                  setHighLight(updated);
                }}
                className="text-red-500 hover:text-red-700 font-bold text-xl px-2"
                title="Remove this field"
              >
                <X className="cursor-pointer" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setHighLight([...highLight, { key: "", value: "" }])}
          className="text-sm hover:text-blue-500 cursor-pointer hover:underline"
        >
          Add Highlight
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-xl mb-8 shadow text-center p-2">
          Box Content
        </h4>
        {boxContent.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <div className="flex flex-col w-full">
              <div className="relative">
                <input
                  id={`floatingbox${index}`}
                  value={item.key}
                  onChange={(e) => {
                    const updated = [...boxContent];
                    updated[index].key = e.target.value;
                    setBoxContent(updated);
                  }}
                  type="text"
                  className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor={`floatingbox${index}`}
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Enter Key <span className="text-red-500">*</span>{" "}
                </label>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <div className="relative">
                <input
                  id={`floating_boxvalue${index}`}
                  value={item.value}
                  onChange={(e) => {
                    const updated = [...boxContent];
                    updated[index].value = e.target.value;
                    setBoxContent(updated);
                  }}
                  type="text"
                  className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor={`floating_boxvalue${index}`}
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Enter Value <span className="text-red-500">*</span>{" "}
                </label>
              </div>
            </div>
            {boxContent.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  const updated = [...boxContent];
                  updated.splice(index, 1); // remove this item
                  setBoxContent(updated);
                }}
                className="text-red-500 hover:text-red-700 font-bold text-xl px-2"
                title="Remove this field"
              >
                <X className="cursor-pointer" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setBoxContent([...boxContent, { key: "", value: "" }])}
          className="text-sm hover:text-blue-500 cursor-pointer hover:underline"
        >
          Add Box Content
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-xl mb-8 shadow text-center p-2">
          Tags Keywords & Mesuarment Image
        </h4>

        <div className="flex items-center gap-1 lg:gap-2">
          <div className="relative w-1/2">
            <input
              id="floating_tag"
              value={tags.join(",")}
              onChange={(e) =>
                setTags(e.target.value.split(",").map((t) => t.trim()))
              }
              type="text"
              className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="floating_tag"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Enter tags
            </label>
          </div>
          <div className="relative w-1/2">
            <input
              id="floating_img"
              onChange={handleFileChange}
              type="file"
              className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="floating_img"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Mesuarment Image
            </label>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Measurement Preview"
                width={200}
                height={200}
                className="w-16 h-10 m-1"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mb-20">
        <div className="mt-4 relative">
          <h4 className="text-xl font-semibold my-4 text-center border py-1.5 rounded-sm select-none bg-black text-white border-orange-600">
            Multiple Color Variants
          </h4>

          {colorVariants.map((variant, i) => (
            <div
              key={i}
              className="border rounded-sm border-gray-300 pt-12 px-3 mb-4 space-y-4 relative"
            >
              <h2 className="text-base font-semibold absolute border border-blue-600 rounded-sm py-1 px-3 top-1">
                Color Variant Serial{" "}
                <span className="text-blue-500">({i + 1})</span>
              </h2>
              {1 < colorVariants.length && !id && (
                <button
                  type="button"
                  onClick={() => removeColorVariant(i)}
                  className="right-4 top-3 cursor-pointer absolute text-sm border-red-600 rounded-sm hover:text-red-600 hover:border py-1 px-2"
                >
                  Remove Color Variant ({i + 1})
                </button>
              )}

              {/* Color Name */}

              <div className="flex w-full gap-2">
                <div className="relative w-1/2">
                  <div className="relative">
                    <input
                      id={`color_name_djhfsk${i}`}
                      value={variant.name}
                      onChange={(e) =>
                        handleColorVariantChange(i, "name", e.target.value)
                      }
                      type="text"
                      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor={`color_name_djhfsk${i}`}
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 mx-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      Enter Product Color Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>

                {/* Quantity */}
                <div className="relative w-1/2">
                  <div className="relative">
                    <input
                      id={`quantity_1234${i}`}
                      value={variant.quantity}
                      onChange={(e) =>
                        handleColorVariantChange(i, "quantity", e.target.value)
                      }
                      type="number"
                      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor={`quantity_1234${i}`}
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 mx-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      Enter Product Quantity{" "}
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full">
                {/* Category Selector */}
                <div className="relative w-1/2">
                  <Select
                    onValueChange={(value) =>
                      handleColorVariantChange(i, "category", value)
                    }
                    className="block px-2.5 pb-2 pt-3 "
                  >
                    <SelectTrigger
                      id={`category_selector_${i}`}
                      className="w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    >
                      {variant.category || "Choose Style"}
                    </SelectTrigger>
                    <SelectContent>
                      {productSizes.map((category) => (
                        <SelectItem key={category.title} value={category.title}>
                          {category.title.charAt(0).toUpperCase() +
                            category.title.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <label
                    htmlFor={`category_selector_${i}`}
                    className="absolute text-xs text-gray-500 duration-300 transform -translate-y-3 scale-90 top-1 z-10 bg-white px-2 mx-2 peer-focus:text-blue-600"
                  >
                    Select Style<span className="text-red-500">*</span>
                  </label>
                </div>

                {/* Sizes */}
                {variant.category && (
                  <div className="space-y-2 w-1/2">
                    <Label className="font-semibold shadow-xs p-2">
                      Select Sizes
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {productSizes
                        .find((cat) => cat.title === variant.category)
                        ?.value.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeToggle(i, size)}
                            type="button"
                            className={`px-3 py-1 rounded border text-sm transition ${
                              variant.size.includes(size)
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-100"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Image Upload */}
              <div>
                <Label className="p-2 border-b mb-2 rounded-sm py-3">
                  Select Images <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageChange(i, e.target.files)}
                  className="input w-1/2"
                />
                <div className="flex flex-wrap gap-2 py-2">
                  {variant.images.map((file, idx) => (
                    <img
                      key={idx}
                      src={
                        file instanceof File
                          ? URL.createObjectURL(file)
                          : file.url
                      }
                      alt={`preview-${idx}`}
                      className=" w-14 h-14 rounded-sm border"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="hover:underline hover:text-blue-500 font-medium text-sm cursor-pointer absolute bottom-[-25px] outline-none left-1"
            onClick={addColorVariant}
          >
            Add Color Variant
          </button>
        </div>
      </div>
      <div className="flex justify-end  px-2 lg:px-4">
        <Label className="flex gap-2 items-center">
          <Checkbox
            className="h-5 w-5 cursor-pointer"
            checked={isFeatured}
            onCheckedChange={(checked) => setIsFeatured(checked === true)}
          />
          {isFeatured ? (
            <span className="text-green-500">Featured</span>
          ) : (
            <span className="text-red-500">Not Featured</span>
          )}
        </Label>
      </div>
      <div
        type="submit"
        disabled={isLoading}
        className={`flex  font-semibold cursor-pointer py-4 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <button className=" bg-black text-white border border-red-600 px-4 rounded-sm  py-2 right-2 top-2 text-lg font-semibold cursor-pointer flex items-center gap-2">
          {isLoading ? (
            <>
              <Loader strokeWidth={3} className="h-6 w-6  animate-spin" />
              PROCESSING...
            </>
          ) : id ? (
            "UPDATE PRODUCT"
          ) : (
            <>
              <UploadCloud className="h-5 w-5" />
              PUBLISH PRODUCT
            </>
          )}
        </button>
      </div>
    </form>
  );
}
