"use client";

import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { productSizes } from "@/static/ProductSize";

export default function Testpage() {
  const [colorVariants, setColorVariants] = useState([
    {
      name: "",
      category: "",
      quantity: 0,
      size: [],
      images: [],
    },
  ]);

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
        quantity: null,
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

  return (
    <div className="p-4 space-y-4 h-screen overflow-y-auto">
      {/* Multiple Color Variants */}
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
            {1 < colorVariants.length && (
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
                    {variant.category || "Choose Category"}
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
                  Product Category <span className="text-red-500">*</span>
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
  );
}
