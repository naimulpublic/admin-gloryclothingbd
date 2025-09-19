"use client";
import { X } from "lucide-react";
import React from "react";
import { CInput } from "../input/Input";
import { SquarePlus } from "lucide-react";

export default function KeyValue({ items, setItems, title }) {
  // Key পরিবর্তনের ফাংশন
  const handleKeyChange = (index, newKey) => {
    const updated = [...items];
    updated[index].key = newKey;
    setItems(updated);
  };

  // Value পরিবর্তনের ফাংশন
  const handleValueChange = (index, newValue) => {
    const updated = [...items];
    updated[index].value = newValue;
    setItems(updated);
  };

  // একটি আইটেম remove করার ফাংশন
  const handleRemove = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // নতুন আইটেম add করার ফাংশন
  const handleAdd = () => {
    setItems([...items, { key: "", value: "" }]);
  };

  return (
    <div>
      <h4 className="test-sm md:text-md md:font-medium text-center py-0.5 md:py-1 border border-green-200 rounded-xs bg-green-50">
        {title}
      </h4>
      {items.map((item, index) => (
        <div key={index} className="md:flex gap-2 mt-2">
          {/* Key Input */}
          <div className={`${index === 0 ? "md:w-1/2" : "md:w-[42.5%]"}`}>
            <CInput
              label={
                <div>
                  Enter Key <span>*</span>
                </div>
              }
              required={false}
              value={item.key}
              onChange={(e) => handleKeyChange(index, e.target.value)}
              id={`${title}-Key-${index + 1}`}
            />
          </div>

          {/* Value Input */}
          <div
            className={`mt-2 md:mt-0 ${
              index === 0 ? "md:w-1/2" : "md:w-[42.5%]"
            }`}
          >
            <CInput
              label={
                <div>
                  Enter Value <span>*</span>
                </div>
              }
              required={false}
              value={item.value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              id={`${title}-Value-${index + 1}`}
            />
          </div>

          {/* Remove Button */}
          {index > 0 && (
            <div className="mt-1 md:w-[15%] flex items-center justify-end md:justify-center">
              <button
                className="flex hover:bg-red-500 hover:text-white items-center md:gap-1 text-xs md:text-sm font-semibold cursor-pointer border px-1 py-0.5 md:px-2 md:py-1 rounded-sm text-red-600 border-red-600"
                type="button"
                onClick={() => handleRemove(index)}
              >
                <X className="h-4 w-4 md:h-5 md:w-5" /> <span>Remove</span>
              </button>
            </div>
          )}
          <div className="border-b pb-2 border-dashed border-green-500 md:hidden"></div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        className="mt-1 mx-1 flex items-center gap-1 shadow-xs shadow-orange-300 text-sm py-1 px-2 rounded-xs cursor-pointer"
        onClick={handleAdd}
      >
        <SquarePlus size={16} />
       {title}
      </button>
    </div>
  );
}
