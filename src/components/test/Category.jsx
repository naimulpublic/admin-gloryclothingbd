"use client";
import React, { useState } from "react";

export default function CategorySelector({ categoriesData }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedSubchilds, setSelectedSubchilds] = useState([]);

  const categoryObj = categoriesData.find(
    (cat) => cat.slug === selectedCategory?.slug
  );

  const allSubchilds = selectedSubcategories.flatMap((sub) => {
    const subObj = categoryObj?.subcategories?.find((s) => s.slug === sub.slug);
    return subObj?.subChild || [];
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Category:", selectedCategory);
    console.log("Selected Subcategories:", selectedSubcategories);
    console.log("Selected Subchilds:", selectedSubchilds);
  };

  return (
    <form className="p-4 space-y-4" onSubmit={handleSubmit}>
      {/* Category (Single Select) */}
      <select
        className="border p-2 w-full"
        value={selectedCategory ? JSON.stringify(selectedCategory) : ""}
        onChange={(e) => {
          const value = e.target.value;
          setSelectedCategory(value ? JSON.parse(value) : null);
          setSelectedSubcategories([]);
          setSelectedSubchilds([]);
        }}
      >
        <option value="">Select Category</option>
        {categoriesData.map((cat) => (
          <option
            key={cat._id}
            value={JSON.stringify({ slug: cat.slug, name: cat.name })}
          >
            {cat.name}
          </option>
        ))}
      </select>

      {categoryObj?.subcategories?.length > 0 && (
        <select
          className="border p-2 w-full"
          multiple
          value={selectedSubcategories.map((sub) => JSON.stringify(sub))}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, (option) =>
              JSON.parse(option.value)
            );
            setSelectedSubcategories(selected);
            setSelectedSubchilds([]);
          }}
        >
          {categoryObj.subcategories.map((sub) => (
            <option
              key={sub.slug}
              value={JSON.stringify({ slug: sub.slug, name: sub.name })}
            >
              {sub.name || sub.slug}
            </option>
          ))}
        </select>
      )}

      {/* Subchild (Multiple Select) */}
      {allSubchilds.length > 0 && (
        <select
          className="border p-2 w-full"
          multiple
          value={selectedSubchilds.map((child) => JSON.stringify(child))}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, (option) =>
              JSON.parse(option.value)
            );
            setSelectedSubchilds(selected);
          }}
        >
          {allSubchilds.map((child) => (
            <option
              key={child.slug}
              value={JSON.stringify({ slug: child.slug, name: child.name })}
            >
              {child.name} (from:{" "}
              {categoryObj.subcategories.find((sub) =>
                sub.subChild?.some((sc) => sc.slug === child.slug)
              )?.name || "Unknown"}
              )
            </option>
          ))}
        </select>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>
    </form>
  );
}
