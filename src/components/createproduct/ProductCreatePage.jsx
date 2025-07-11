"use client";

import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { RefreshCcw } from "lucide-react";
import dynamic from "next/dynamic";

const ReactSelect = dynamic(() => import("react-select"), {
  ssr: false,
});
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import RoutePath from "../dashboardlayout/clients/RoutePath";

export default function ProductForm({
  id,
  brandData = [],
  categoriesData = [],
  subcategori = [],
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
  const [defaultColor, setDefaultColor] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [subcategory, setSubcategory] = useState([]);
  const [specification, setSpecification] = useState([{ key: "", value: "" }]);
  const [highLight, setHighLight] = useState([{ key: "", value: "" }]);
  const [boxContent, setBoxContent] = useState([{ key: "", value: "" }]);
  const [tags, setTags] = useState([]);

  const [colorVariants, setColorVariants] = useState([
    {
      name: "",
      quantity: 0,
      size: [],
      images: [],
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
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
            setDefaultColor(data.defaultColor || "");
            setIsFeatured(data.isFeatured || false);

            setSubcategory(
              Array.isArray(data.subcategory)
                ? data.subcategory.map((item) => ({
                    label: item.label||"",
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

    setIsLoading(true);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("price", price);
    formData.append("mrp", mrp);
    formData.append("brand", brand);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("defaultColor", defaultColor);
    formData.append("isFeatured", isFeatured);

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
        alert(result.message);
      } else {
        alert("Failed to submit product.");
      }
    } catch (error) {
      console.error("Error occurred while submitting product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorVariantChange = (index, field, value) => {
    const updated = [...colorVariants];
    if (field === "size") {
      updated[index][field] = value.split(",").map((s) => s.trim());
    } else {
      updated[index][field] = value;
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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 w-full px-6 bg-white rounded shadow"
    >
      <RoutePath />
      <h2 className="text-xl font-semibold my-4 text-center border py-1.5 rounded-sm select-none bg-black text-white border-orange-600">Add New Product</h2>
      <div className="flex gap-2">
        <div className="w-1/2">
          <Label className="p-2">
            Enter Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div className="w-1/2 relative">
          <Label className="p-2">
            Genarate Slug <span className="text-red-500">*</span>
          </Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug"
          />
          <button
            type="button"
            onClick={generateSlug}
            className="p-2 absolute top-7 hover:text-blue-500  right-2 cursor-pointer"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-1/2">
          <Label className="p-2">
            Enter Product Meta Title <span className="text-red-500">*</span>
          </Label>
          <Input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Meta Title"
          />
        </div>
        <div className="w-1/2">
          <Label className="p-2">
            Enter Product Meta Discription{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Meta Discription"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-1/2">
          <Label className="p-2">
            Enter Product Price <span className="text-red-500">*</span>
          </Label>
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            type="number"
          />
        </div>
        <div className="w-1/2">
          <Label className="p-2">
            Enter Product MRP <span className="text-red-500">*</span>
          </Label>
          <Input
            value={mrp}
            onChange={(e) => setMrp(e.target.value)}
            placeholder="MRP"
            type="number"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-1/2">
          <Label className="p-2">
            Select Product Brand <span className="text-red-500">*</span>
          </Label>
          <Select value={brand} onValueChange={(value) => setBrand(value)}>
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
        </div>

        <div className="w-1/2">
          <Label className="p-2">
            Enter Product Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product Description"
            className="input w-full"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-1/2">
          <Label className="p-2">
            Select Product Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger className="w-full">
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
        </div>

        <div className="w-1/2">
          <Label className="p-2">
            Enter Product Subcategory <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            isMulti
            options={(subcategori || []).map((sub) => ({
              value: sub._id,
              label: sub.value,
            }))}
            value={subcategory}
            onChange={(selectedOptions) =>
              setSubcategory(selectedOptions || [])
            }
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Select subcategories..."
          />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-1/2">
          <Label className="p-2">
            Enter Product Default Color <span className="text-red-500">*</span>
          </Label>
          <Input
            value={defaultColor}
            onChange={(e) => setDefaultColor(e.target.value)}
            placeholder="Default Color"
          />
        </div>

        <div className="w-1/2">
          <Label className="flex gap-2 items-center mt-8">
            <Checkbox
              className="h-5 w-5 cursor-pointer"
              checked={isFeatured}
              onCheckedChange={(checked) => setIsFeatured(checked === true)}
            />
            Featured Product
          </Label>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Specification</h4>
        {specification.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <div className="flex flex-col w-full">
              <Label className="p-2">
                Enter Key <span className="text-red-500">*</span>
              </Label>
              <Input
                value={item.key}
                onChange={(e) => {
                  const updated = [...specification];
                  updated[index].key = e.target.value;
                  setSpecification(updated); // Update the specification state
                }}
                placeholder="Key"
                className="input"
              />
            </div>
            <div className="flex flex-col w-full">
              <Label className="p-2">
                Enter Value <span className="text-red-500">*</span>
              </Label>
              <Input
                value={item.value}
                onChange={(e) => {
                  const updated = [...specification];
                  updated[index].value = e.target.value;
                  setSpecification(updated); // Update the specification state
                }}
                placeholder="Value"
                className="input"
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={
            () => setSpecification([...specification, { key: "", value: "" }]) // Add a new specification field
          }
          className="btn text-sm bg-gray-200 px-3 py-1 rounded"
        >
          + Add Specification
        </Button>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Highlights</h4>
        {highLight.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <div className="flex flex-col w-full">
              <Label className="p-2">
                Enter Key <span className="text-red-500">*</span>
              </Label>
              <Input
                value={item.key}
                onChange={(e) => {
                  const updated = [...highLight];
                  updated[index].key = e.target.value;
                  setHighLight(updated);
                }}
                placeholder="Key"
                className="input "
              />
            </div>

            <div className="flex flex-col w-full">
              <Label className="p-2">
                Enter Value <span className="text-red-500">*</span>
              </Label>
              <Input
                value={item.value}
                onChange={(e) => {
                  const updated = [...highLight];
                  updated[index].value = e.target.value;
                  setHighLight(updated);
                }}
                placeholder="Value"
                className="input "
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => setHighLight([...highLight, { key: "", value: "" }])}
          className="btn text-sm bg-gray-200 px-3 py-1 rounded"
        >
          + Add Highlight
        </Button>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Box Content</h4>
        {boxContent.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <div className="flex flex-col w-full">
              <Label className="p-2">
                Enter Key <span className="text-red-500">*</span>
              </Label>
              <Input
                value={item.key}
                onChange={(e) => {
                  const updated = [...boxContent];
                  updated[index].key = e.target.value;
                  setBoxContent(updated);
                }}
                placeholder="Key"
                className="input "
              />
            </div>
            <div className="flex flex-col w-full">
              <Label className="p-2">
                Enter Value <span className="text-red-500">*</span>
              </Label>
              <Input
                value={item.value}
                onChange={(e) => {
                  const updated = [...boxContent];
                  updated[index].value = e.target.value;
                  setBoxContent(updated);
                }}
                placeholder="Value"
                className="input "
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => setBoxContent([...boxContent, { key: "", value: "" }])}
          className="btn text-sm bg-gray-200 px-3 py-1 rounded"
        >
          + Add Box Content
        </Button>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Tags</h4>
        <Input
          value={tags.join(",")}
          onChange={(e) =>
            setTags(e.target.value.split(",").map((t) => t.trim()))
          }
          placeholder="Enter tags separated by commas"
          className="input w-full"
        />
      </div>

      <div className="mt-6 relative">
        <h4 className="text-xl font-semibold my-4 text-center border py-1.5 rounded-sm select-none bg-black text-white border-orange-600">
          Multiple Color Variants
        </h4>
        {colorVariants.map((variant, i) => (
          <div
            key={i}
            className="border border-gray-300 p-3 rounded mb-4 space-y-2 relative"
          >
            <Button
              type="button"
              onClick={() => removeColorVariant(i)}
              className=" text-red-600 border border-red-600-200 px-3 py-1 rounded border-red-600 right-3 top-1 cursor-pointer absolute"
            >
              Remove Variant
            </Button>
            <div className="flex gap-2">
              <div className="w-1/2">
                <Label className="p-2">
                  Enter Color Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={variant.name}
                  onChange={(e) =>
                    handleColorVariantChange(i, "name", e.target.value)
                  }
                  placeholder="Color Name (e.g. Red)"
                  className="input w-full"
                />
              </div>
              <div className="w-1/2">
                <Label className="p-2">
                  Enter Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={variant.quantity}
                  onChange={(e) =>
                    handleColorVariantChange(i, "quantity", e.target.value)
                  }
                  placeholder="Quantity"
                  type="number"
                  className="input w-full"
                />
              </div>
            </div>
            <div>
              <Label className="p-2">
                Select Sizes <span className="text-red-500">*</span>
              </Label>
              <Input
                value={variant.size.join(",")}
                onChange={(e) =>
                  handleColorVariantChange(i, "size", e.target.value)
                }
                placeholder="Sizes (comma separated)"
                className="input w-full"
              />
            </div>
            <div>
              <Label className="p-2">
                Select Images <span className="text-red-500">*</span>
              </Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(i, e.target.files)}
                className="input w-1/2"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {variant.images.map((file, idx) => (
                <img
                  key={idx}
                  src={
                    file instanceof File ? URL.createObjectURL(file) : file.url
                  }
                  alt={`preview-${idx}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="hover:underline hover:text-blue-500 font-medium cursor-pointer absolute bottom-[-30px] right-5"
          onClick={addColorVariant}
        >
          + Add Color Variant
        </button>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className={`mb-10 font-semibold cursor-pointer py-4 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : id ? (
          "Update Product"
        ) : (
          "Create Product"
        )}
      </Button>
    </form>
  );
}
