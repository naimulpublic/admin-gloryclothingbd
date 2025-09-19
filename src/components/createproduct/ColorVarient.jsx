"use client";

import { CInput } from "@/custom/input/Input";
import CSelect from "@/custom/select/Select";
import { productSizes } from "@/static/ProductSize";
import { SquarePlus } from "lucide-react";
import { X } from "lucide-react";
import { ImagePlus } from "lucide-react";

export default function ColorVariants({
  colorVariants,
  setColorVariants,

  id,
}) {
  // ---------- Functions এখানে ----------
  const handleColorVariantChange = (index, field, value) => {
    const updated = [...colorVariants];
    updated[index][field] = value;
    setColorVariants(updated);
  };

  const handleSizeToggle = (index, size) => {
    const updated = [...colorVariants];
    if (updated[index].size.includes(size)) {
      updated[index].size = updated[index].size.filter((s) => s !== size);
    } else {
      updated[index].size.push(size);
    }
    setColorVariants(updated);
  };

  const removeColorVariant = (index) => {
    const updated = [...colorVariants];
    updated.splice(index, 1);
    setColorVariants(updated);
  };

  const addColorVariant = () => {
    setColorVariants([
      ...colorVariants,
      { name: "", quantity: 0, size: [], images: [], category: "" },
    ]);
  };

  const handleImageChange = (index, files) => {
    const updated = [...colorVariants];
    const newImages = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file), // preview
      file, // original file
    }));
    updated[index].images = [...updated[index].images, ...newImages];
    setColorVariants(updated);
  };

  const removeImage = (variantIndex, imgIndex) => {
    const updated = [...colorVariants];
    updated[variantIndex].images = updated[variantIndex].images.filter(
      (_, i) => i !== imgIndex
    );
    setColorVariants(updated);
  };
  // ---------- JSX ----------
  return (
    <div className="mt-4 relative">
      <h4 className="text-sm md:text-lg font-medium text-center border py-1 rounded-xs select-none bg-green-50 border-green-200">
        Multiple Color Variants
      </h4>

      {colorVariants.map((variant, i) => (
        <div
          key={i}
          className="shadow-xs shadow-green-200 border border-green-100 rounded-xs pt-10 md:pt-12 md:pb-2 px-3 space-y-4 relative mt-2"
        >
          <h2 className="text-green-500 text-xs md:text-sm absolute shadow-xs shadow-green-500 border rounded-xs py-1 px-3 top-1 md:top-2">
            Variant Serial <span className="text-blue-500">({i + 1})</span>
          </h2>

          {colorVariants.length > 1 && i !== 0 && (
            <button
              type="button"
              onClick={() => removeColorVariant(i)}
              className="shadow-xs shadow-red-500 right-4 top-1 md:top-2 cursor-pointer absolute text-xs md:text-sm border-red-600 rounded-xs hover:text-red-600 hover:border py-1 px-2"
            >
              Remove Variant ({i + 1})
            </button>
          )}

          {/* Color Name + Quantity */}
          <div className="md:flex w-full gap-2">
            {/* Color Name */}
            <div className="relative md:w-1/2">
              <CInput
                id={`color_name_${i}`}
                label={
                  <div>
                    Color Name <span className="text-red-500">*</span>
                  </div>
                }
                value={variant.name}
                onChange={(e) =>
                  handleColorVariantChange(i, "name", e.target.value)
                }
                type="text"
              />
            </div>

            {/* Quantity */}
            <div className="relative mt-2 md:mt-0 md:w-1/2">
              <CInput
                label={
                  <div>
                    Quantity <span className="text-red-500">*</span>
                  </div>
                }
                id={`quantity_${i}`}
                value={variant.quantity}
                onChange={(e) =>
                  handleColorVariantChange(i, "quantity", e.target.value)
                }
                type="number"
              />
            </div>
          </div>

          {/* Category + Sizes */}
          <div className="md:flex gap-2 w-full">
            <div className="relative md:w-1/2">
              <CSelect
                id={`category_${i}`}
                options={productSizes.map((cat) => ({ name: cat.title }))}
                selected={variant.category ? { name: variant.category } : null}
                placeholder="Choose Style"
                onChange={(opt) =>
                  handleColorVariantChange(i, "category", opt.name)
                }
              />
            </div>

            {variant.category && (
              <div className="space-y-2 mt-2 md:mt-0 md:w-1/2">
                <h4 className="test-sm md:text-md md:font-medium text-center py-0.5 md:py-1 border border-green-200 rounded-xs bg-green-50">
                  Select Size
                </h4>
                <div className="flex flex-wrap gap-2">
                  {productSizes
                    .find((cat) => cat.title === variant.category)
                    ?.value.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeToggle(i, size)}
                        type="button"
                        className={`px-2 py-1 rounded-xs shadow-sm shadow-green-200 text-sm ${
                          variant.size.includes(size)
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="test-sm md:text-md md:font-medium text-center py-0.5 md:py-1 border border-green-200 rounded-xs bg-green-50">
              Upload Image
            </h4>

            <div className="flex flex-wrap gap-2 my-2">
              {variant.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative border-1 md:border-2 border-dashed border-green-300 p-0.5 md:p-1 w-16 h-16 md:w-20 md:h-20 rounded-sm overflow-hidden group"
                >
                  <img
                    src={img.url}
                    alt={`preview-${idx}`}
                    className="w-full h-full rounded-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i, idx)}
                    className="absolute cursor-pointer p-1 top-1 right-1 bg-black/60 text-white rounded-full hover:bg-red-600"
                  >
                    <X strokeWidth={3} size={16} />
                  </button>
                </div>
              ))}

              <label className="w-16 h-16 md:w-20 md:h-20 border-1 md:border-2 border-dashed border-green-300 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100">
                <ImagePlus size={30} className=" text-gray-500" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageChange(i, e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="flex items-center gap-1  absolute bottom-[-32px] right-0 shadow-xs shadow-orange-400 text-sm py-1 px-2 rounded-xs cursor-pointer"
        onClick={addColorVariant}
      >
        <SquarePlus size={16} />
        Color Variant
      </button>
    </div>
  );
}
