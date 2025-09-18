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

import { toast } from "sonner";
import SubmitButton from "@/custom/submit/Submit";
import KeyValue from "@/custom/keyvaluefild/KeyValue";
import { CInput } from "@/custom/input/Input";
import { CInputArea } from "@/custom/input/InputArea";
import CSelect from "@/custom/select/Select";
import { MultiSelect } from "@/custom/select/MultiSelect";
import { ChevronDown } from "lucide-react";
import { ImagePlus } from "lucide-react";

export default function ProductForm({
  id,
  brandData = [],
  categoriesData = [],
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [mrp, setMrp] = useState(0);
  const [brand, setBrand] = useState({ name: "", slug: "" });
  const [category, setCategory] = useState({ name: "", slug: "" });
  const [description, setDescription] = useState("");

  const [defaultColor, setDefaultColor] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [subcategory, setSubcategory] = useState([]);
  const [specification, setSpecification] = useState([{ key: "", value: "" }]);
  const [highLight, setHighLight] = useState([{ key: "", value: "" }]);
  const [boxContent, setBoxContent] = useState([{ key: "", value: "" }]);
  const [subchild, setSubchild] = useState([]);

  const [measurementImage, setMeasurementImage] = useState(null);
  const [subcategoriesOptions, setSubcategoriesOptions] = useState([]);
  const [subchildOptions, setSubchildOptions] = useState([]);

  const [colorVariants, setColorVariants] = useState([
    {
      name: "",
      quantity: 0,
      size: [],
      images: [],
    },
  ]);

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
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/product/${id}`
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
            Array.isArray(data.subChild)
              ? data.subChild.map((item) => ({
                  name: item.name || "",
                  slug: item.slug || "",
                }))
              : [];

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

  useEffect(() => {
    if (category?.slug) {
      const selectedCategory = categoriesData.find(
        (cat) => cat.slug === category.slug
      );
      if (selectedCategory) {
        setSubcategoriesOptions(selectedCategory.subcategories || []);
      } else {
        setSubcategoriesOptions([]);
      }

      if (subcategory.length === 0) {
        setSubchildOptions([]);
        setSubcategory([]);
        setSubchild([]);
      }
    }
  }, [category, categoriesData]);

  useEffect(() => {
    if (subcategory.length > 0) {
      let allSubchild = [];
      subcategory.forEach((sub) => {
        const selectedSub = subcategoriesOptions.find(
          (item) => item.slug === sub.slug
        );
        if (selectedSub && selectedSub.subchild) {
          allSubchild = [...allSubchild, ...selectedSub.subchild];
        }
      });
      setSubchildOptions(allSubchild);
    } else {
      setSubchildOptions([]);
      setSubchild([]);
    }
  }, [subcategory, subcategoriesOptions]);

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
    formData.append("subChild", JSON.stringify(subchild));

    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("mrp", mrp);
    formData.append("brand", JSON.stringify(brand));
    formData.append("category", JSON.stringify(category));

    formData.append("defaultColor", defaultColor);
    formData.append("isFeatured", isFeatured);
    formData.append("measurementImage", measurementImage);

    formData.append("subcategory", JSON.stringify(subcategory));
    formData.append("specification", JSON.stringify(specification));
    formData.append("highLight", JSON.stringify(highLight));
    formData.append("boxContent", JSON.stringify(boxContent));

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
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/product/${id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/product`;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
      } else {
        toast.error("Failed to submit product.");
      }
    } catch (error) {
      console.error("Error occurred while submitting product:", error);
    } finally {
      setIsLoading(false);
    }
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
    if (colorVariants.length >= 5) {
      toast.error("Maximum 5 color variants allowed!");
      return;
    }
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

  const removeMeasurement = () => {
    setMeasurementImage(null);
    setPreviewUrl(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full px-2 lg:px-6 bg-white rounded shadow overflow-hidden"
    >
      <RoutePath />
      <h2 className=" text-sm lg:text-xl font-medium lg:font-semibold my-2 lg:my-4 text-center border py-1 lg:py-1.5 rounded-sm select-none bg-black text-white border-orange-600">
        {id ? "Edit" : "Create New"} Product
      </h2>
      <div className="md:flex gap-2">
        <div className="md:w-1/2 mt-4 md:mt-0">
          <CInput
            label={
              <div>
                Enter Product Name <span className="text-red-500">*</span>
              </div>
            }
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            {...(!id ? { required: true } : {})}
          />
        </div>
        <div className=" md:w-1/2 relative mt-2 sm:mt-0">
          <CInput
            label={
              <div>
                Genarate Slug <span className="text-red-500">*</span>
              </div>
            }
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            {...(!id ? { required: true } : {})}
          />
          <button
            type="button"
            onClick={generateSlug}
            className="p-[10px] absolute top-[0px] text-white font-bold bg-orange-500 rounded-r-lg right-0 cursor-pointer"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>
      <div className="md:flex gap-2">
        <div className="md:w-1/2 ">
          <CInput
            label={
              <div>
                Meta Title <span>*</span>
              </div>
            }
            required={false}
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            id="Meta Title"
          />
        </div>
        <div className="md:w-1/2 mt-2 md:mt-0">
          <CInputArea
            label={
              <div>
                Meta Discription <span>*</span>
              </div>
            }
            required={false}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            id="Meta Discription"
          />
        </div>
      </div>
      <div className="flex gap-1 md:gap-2">
        <div className="w-1/2">
          <CInput
            label={
              <div>
                Price <span className="text-red-500">*</span>
              </div>
            }
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            id="Price"
            type="number"
          />
        </div>
        <div className="w-1/2">
          <CInput
            label={
              <div>
                MRP <span className="text-red-500">*</span>
              </div>
            }
            value={mrp}
            onChange={(e) => setMrp(e.target.value)}
            id="MRP"
            type="number"
            {...(!id ? { required: true } : {})}
          />
        </div>
      </div>

      <div className="md:flex gap-1 lg:gap-2">
        <div className="md:w-1/2">
          <CSelect
            placeholder="Select Brands"
            id="brand"
            options={brandData.map((item) => ({
              name: item.name,
              slug: item.slug,
            }))}
            selected={brand}
            onChange={(val) => setBrand(val)}
          />
        </div>

        <div className="mt-2 md:mt-0 md:w-1/2">
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

      <div className="md:flex gap-1 lg:gap-2">
        <div className="md:w-1/2">
          <CSelect
            placeholder="Seclect Category"
            id="category"
            options={categoriesData.map((item) => ({
              name: item.name,
              slug: item.slug,
            }))}
            selected={category}
            onChange={(val) => setCategory(val)}
          />
        </div>

        <div className="mt-2 md:mt-0  md:w-1/2">
          <MultiSelect
            options={subcategoriesOptions.map((sub) => ({
              name: sub.name,
              slug: sub.slug,
            }))}
            selected={subcategory}
            onChange={setSubcategory}
            placeholder={
              <div className="cursor-pointer flex items-center justify-between w-full">
                <div>
                  Select Subcategory <span className="text-red-500">*</span>
                </div>
                <ChevronDown />
              </div>
            }
          />
        </div>
      </div>

      <div className="md:flex gap-1 lg:gap-2">
        <div className="md:w-1/2">
          <MultiSelect
            options={subchildOptions.map((child) => ({
              name: child.name,
              slug: child.slug,
            }))}
            selected={subchild}
            onChange={setSubchild}
            placeholder={
              <div className="cursor-pointer flex items-center justify-between w-full">
                <div>
                  Select Subcategory Child{" "}
                  <span className="text-red-500">*</span>
                </div>
                <ChevronDown />
              </div>
            }
          />
        </div>

        <div className="md:w-1/2 mt-2 md:mt-0">
          <p className="test-sm md:text-md md:font-medium py-0.5 md:py-1 border border-green-200 rounded-xs bg-green-50 text-center mb-2">
            Measurement Image
          </p>

          <div className="flex items-center">
            <div className="relative w-1/2">
              <label className="relative w-20 h-20 lg:w-24 lg:h-24 p-1 rounded-sm overflow-hidden border-dashed border border-gray-300 flex items-center justify-center cursor-pointer hover:border-green-500">
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Measurement Preview"
                      className="w-full h-full rounded-sm"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMeasurement();
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
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <KeyValue
        items={specification}
        setItems={setSpecification}
        title="Product Specification"
      />
      <KeyValue
        items={highLight}
        setItems={setHighLight}
        title="Product Highlight"
      />
      <KeyValue
        items={boxContent}
        setItems={setBoxContent}
        title="Box Content "
      />

      <div className="">
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

      <div className="mb-10">
        <SubmitButton id={id} isLoading={isLoading} name="Product" />
      </div>
    </form>
  );
}
