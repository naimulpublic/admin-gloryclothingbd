"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import React from "react";

function RoutePath() {
  const pathname = usePathname();
  const router = useRouter();

  const paths = pathname.split("/").filter((p) => p);

  const filteredPaths = paths[0] === "Home" ? paths.slice(1) : paths;

  // cumulative path তৈরি করা
  const getPathTo = (index) => {
    const base = paths[0] === "Home" ? "/home" : "";
    const newPath = [base, ...filteredPaths.slice(0, index + 1)].join("/");
    return newPath;
  };

  return (
    <div className="text-black text-xs lg:text-sm lg:text-md lg:font-medium flex items-center gap-1 shadow-xs shadow-orange-300 border-b p-2 lg:p-3 bg-white flex-wrap">
      {/* Home link */}
      <span
        onClick={() => router.push("/")}
        className="tracking-wide cursor-pointer hover:underline"
      >
        Home
      </span>

      {filteredPaths.map((segment, index) => {
        const isLast = index === filteredPaths.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="size-4 lg:size-5 text-gray-400" />
            <span
              onClick={() => router.push(getPathTo(index))}
              className={`capitalize cursor-pointer ${
                isLast
                  ? "text-blue-600 font-semibold" // ✅ Current page blue
                  : "hover:underline"
              }`}
            >
              {segment.replaceAll("-", " ")}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default RoutePath;
