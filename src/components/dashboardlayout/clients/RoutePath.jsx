"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import React from "react";

function RoutePath() {
  const pathname = usePathname();

  const paths = pathname.split("/").filter((p) => p);

  const filteredPaths = paths[0] === "dashboard" ? paths.slice(1) : paths;

  return (
    <div className="text-black font-medium flex items-center">
      <span className="tracking-wide">Dashboard</span>

      {filteredPaths.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="size-5 text-gray-400" />
          <span className="capitalize">{segment.replaceAll("-", " ")}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

export default RoutePath;
