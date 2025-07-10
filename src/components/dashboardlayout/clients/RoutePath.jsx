"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, House } from "lucide-react";
import React from "react";

function RoutePath() {
  const pathname = usePathname();

  return (
    <div className="text-textheader">
      {pathname === "/" ? (
        <div className="flex items-center">
          <House className="w-7 h-7 mr-2 text-orange-500 dark:text-orange-400" />
          <span className="tracking-wide border-b border-orange-500">
            DashBoard
          </span>
          <ChevronRight />
        </div>
      ) : (
        <span className="tracking-wide text-white text-base">
          {pathname.replace("/", "").replaceAll("-", " ")}
        </span>
      )}
    </div>
  );
}

export default RoutePath;
