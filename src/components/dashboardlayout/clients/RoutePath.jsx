"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import React from "react";

function RoutePath() {
  const pathname = usePathname();
  const router = useRouter();

  const paths = pathname.split("/").filter((p) => p);

  const filteredPaths = paths[0] === "dashboard" ? paths.slice(1) : paths;

  // cumulative path তৈরি করা
  const getPathTo = (index) => {
    const base = paths[0] === "dashboard" ? "/dashboard" : "";
    const newPath = [base, ...filteredPaths.slice(0, index + 1)].join("/");
    return newPath;
  };

  return (
    <div className="text-black font-medium flex items-center gap-1 mt-2 border-b p-2">
      <span
        onClick={() => router.push("/dashboard")}
        className="tracking-wide cursor-pointer text-blue-600 hover:underline"
      >
        Dashboard
      </span>

      {filteredPaths.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="size-5 text-gray-400" />
          <span
            onClick={() => router.push(getPathTo(index))}
            className="capitalize cursor-pointer hover:underline"
          >
            {segment.replaceAll("-", " ")}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

export default RoutePath;
