"use client";

import { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "../../lib/utils";

export function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "--Select subchild--",
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const [popoverWidth, setPopoverWidth] = useState("auto");

  // Ensure selected is always an array and has valid items
  const safeSelected = Array.isArray(selected)
    ? selected.filter((item) => item && (item._id || item.name || item.slug))
    : [];

  // Ensure options is always an array and has valid items
  const safeOptions = Array.isArray(options)
    ? options.filter((opt) => opt && (opt._id || opt.name || opt.slug))
    : [];

  useEffect(() => {
    if (triggerRef.current) {
      setPopoverWidth(`${triggerRef.current.offsetWidth}px`);
    }
  }, [open]);

  const isSelected = (option) => {
    if (!option || (!option._id && !option.name && !option.slug)) return false;
    return safeSelected.some((item) => {
      if (item._id && option._id) return item._id === option._id;
      if (item.name && option.name) return item.name === option.name;
      if (item.slug && option.slug) return item.slug === option.slug;
      return false;
    });
  };

  const toggleOption = (option) => {
    if (!option) return;

    if (isSelected(option)) {
      onChange(
        safeSelected.filter((item) => {
          if (item._id && option._id) return item._id !== option._id;
          if (item.name && option.name) return item.name !== option.name;
          if (item.slug && option.slug) return item.slug !== option.slug;
          return true;
        })
      );
    } else {
      onChange([...safeSelected, option]);
    }
  };

  const getItemKey = (item, index) => {
    if (item?._id) return item._id;
    if (item?.name) return `name-${item.name}`;
    if (item?.slug) return `slug-${item.slug}`;
    return `item-${index}`;
  };

  const getItemLabel = (item) => {
    return item?.name || item?.slug || "Unnamed";
  };

  return (
    <div className="space-y-2 w-full">
      {/* Selected Badges */}
      <div className="flex flex-wrap gap-2">
        {safeSelected.map((item, index) => {
          const label = getItemLabel(item);
          return (
            <Badge
              key={getItemKey(item, index)}
              variant="secondary"
              className="pl-2"
            >
              {label}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-4 ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(item);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}
      </div>

      {/* Dropdown with Checkbox Options */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            className="w-full justify-between h-10"
          >
            {safeSelected.length > 0
              ? `${safeSelected.length} selected`
              : placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 overflow-y-auto max-h-48"
          style={{ width: popoverWidth }}
          align="start"
        >
          <ScrollArea className="max-h-48">
            {safeOptions.length > 0 ? (
              safeOptions.map((opt, index) => (
                <button
                  type="button"
                  key={getItemKey(opt, index)}
                  onClick={() => toggleOption(opt)}
                  className={cn(
                    "w-full flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-muted",
                    isSelected(opt) && "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "mr-2 h-4 w-4 flex items-center justify-center border border-gray-400 rounded-sm",
                      isSelected(opt) ? "bg-primary text-white" : "bg-white"
                    )}
                  >
                    {isSelected(opt) && <Check className="h-3 w-3" />}
                  </span>
                  {getItemLabel(opt)}
                </button>
              ))
            ) : (
              <p className="text-center text-sm text-muted">
                No options available
              </p>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
