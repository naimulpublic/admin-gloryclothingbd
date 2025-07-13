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
  placeholder = "--Select Subcategories--",
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const [popoverWidth, setPopoverWidth] = useState("auto");

  // Ensure selected is always an array
  const safeSelected = Array.isArray(selected) ? selected : [];

  useEffect(() => {
    if (triggerRef.current) {
      setPopoverWidth(`${triggerRef.current.offsetWidth}px`);
    }
  }, [open]);

  const isSelected = (option) =>
    safeSelected.some((item) => item.value === option.value);

  const toggleOption = (option) => {
    if (isSelected(option)) {
      onChange(safeSelected.filter((item) => item.value !== option.value));
    } else {
      onChange([...safeSelected, option]);
    }
  };

  return (
    <div className="space-y-2 w-full">
      {/* Selected Badges */}
      <div className="flex flex-wrap gap-2">
        {safeSelected.map((item, index) => {
          const label = item.label || item.value;
          return (
            <Badge key={index} variant="secondary" className="pl-2">
              {label}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-4 ml-1"
                onClick={() => toggleOption(item)}
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
            className="w-full justify-between h-10 "
          >
            {safeSelected.length > 0
              ? `${safeSelected.length} selected`
              : placeholder}
          </Button>
          
        </PopoverTrigger>

        <PopoverContent
          className="p-0"
          style={{ width: popoverWidth }}
          align="start"
        >
          <ScrollArea className="h-48">
            {options.length > 0 ? (
              options.map((opt, index) => (
                <button
                  type="button"
                  key={index}
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
                  {opt.label}
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
