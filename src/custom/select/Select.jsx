"use client";
import { ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

export default function CSelect({
  id,
  label,
  options = [],
  selected,
  onChange,
  placeholder,
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selected || null); // value = {name, slug}
  const dropdownRef = useRef(null);

  // Click outside close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setValue(option);
    setOpen(false);
    if (onChange) onChange(option);
  };

  useEffect(() => {
    setValue(selected || null);
  }, [selected]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <button
        type="button"
        className="w-full text-left bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 cursor-pointer flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-blue-500"
        onClick={() => setOpen(!open)}
      >
        <div className="w-full">
          {value?.name ? (
            <div className="cursor-pointer w-full">{value.name}</div>
          ) : (
            <div className="cursor-pointer text-sm md:text-md flex items-center justify-between w-full">
              <div>
                {placeholder} <span className="text-red-500">*</span>
              </div>
              <ChevronDown
                className={`size-5 text-gray-500 transition-transform duration-200 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          )}
        </div>
      </button>

      {open && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((opt, index) => (
            <li
              key={index}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(opt)}
            >
              {opt.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
