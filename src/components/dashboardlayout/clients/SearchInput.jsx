"use client";

import React, { useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import { Search } from "lucide-react";

export default function SearchInput() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      <div className="flex items-center rounded-md bg-[#F0F5FF] shadow-sm overflow-hidden w-full">
        <input
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => !inputValue && setIsFocused(false)}
          className="w-full h-10 px-4 rounded-l-sm bg-transparent outline-none text-gray-800 text-md font-semibold placeholder-transparent"
          placeholder="Search products..."
        />

        
        {!isFocused && !inputValue && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none select-none text-md font-medium">
            <span>Search{' '}</span>
            <Typewriter
              words={["Exclusive product", "Fasshion ", "Girl & Boys Fashion "]}
              loop={true}
              cursor
              cursorStyle="..|"
              typeSpeed={80}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </div>
        )}

        <button className="h-10 w-12 bg-orange-500 hover:bg-orange-600 flex items-center justify-center cursor-pointer transition-colors">
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}