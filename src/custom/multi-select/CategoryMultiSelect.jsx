"use client";

import { useState, useRef, useEffect } from "react";
import { X, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function SUbCategoryMultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Select Subcategories",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [width, setWidth] = useState("auto");

  useEffect(() => {
    if (triggerRef.current) {
      setWidth(`${triggerRef.current.offsetWidth}px`);
    }
  }, [open]);

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Check if an option is selected
  const isSelected = (opt) => value.some((item) => item.id === opt.id);

  // Toggle select/unselect
  const toggleSelect = (opt) => {
    if (isSelected(opt)) {
      onChange(value.filter((item) => item.id !== opt.id));
    } else {
      onChange([...value, opt]);
    }
  };

  // Filter by search
  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2 w-full">
      {/* Selected Badges */}
      <div className="flex flex-wrap gap-2">
        {value.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-1 bg-green-200 px-1.5 py-1 rounded-xs text-xs"
          >
            {item.name}
            <button
              type="button"
              onClick={() => toggleSelect(item)}
              className="text-gray-500 hover:text-white hover:bg-red-600 rounded-full p-.5 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Dropdown */}
      <div className="relative">
        <button
          type="button"
          ref={triggerRef}
          onClick={() => setOpen(!open)}
          className="w-full border rounded-md px-3 py-2 flex justify-between items-center bg-white"
        >
          {value.length > 0 ? `${value.length} selected` : placeholder}
          <ChevronDown size={18} />
        </button>

        {open && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1 border bg-white rounded-md shadow-lg p-2"
            style={{ width }}
          >
            {/* Search */}
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-2 px-2 py-1 border rounded-md text-sm"
            />

            {/* Options */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => toggleSelect(opt)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2 cursor-pointer rounded-md hover:bg-gray-100",
                      isSelected(opt) && "bg-gray-200"
                    )}
                  >
                    <span
                      className={cn(
                        "h-4 w-4 flex items-center justify-center border rounded-sm",
                        isSelected(opt) ? "bg-blue-500 text-white" : "bg-white"
                      )}
                    >
                      {isSelected(opt) && <Check size={12} />}
                    </span>
                    {opt.banner && (
                      <img
                        src={opt.banner}
                        alt={opt.name}
                        className="w-6 h-6 rounded object-cover"
                      />
                    )}
                    <span>{opt.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm py-2">
                  No options found
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
