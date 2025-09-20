"use client";
import React, { useEffect, useState } from "react";
import { Menu } from "../../../static/Menu";
import Link from "next/link";
import { ArrowLeftToLine, ChevronDown, ChevronUp } from "lucide-react";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 800) {
          setIsOpen(false); 
        } else {
          setIsOpen(true); 
        }
      };

      handleResize();

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const toggleSubmenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  return (
    <aside
      className={`${
        isOpen ? "w-48 sm:w-52 xl:w-56" : "w-14 sm:w-16 xl:w-20"
      } h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track  scrollbar-thumb-rounded  bg-white border-r border-gray-200 shadow-md transition-all duration-300 ease-in-out relative`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end pr-2 pt-2">
        <ArrowLeftToLine
          onClick={() => setIsOpen(!isOpen)}
          className={`cursor-pointer text-gray-500 hover:text-orange-500 transition-transform duration-300 ${
            !isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <nav className={`mt-4 space-y-1 px-1`}>
        {Menu.map((item, i) => (
          <div key={i} className="relative group w-full">
            <button
              onClick={() => toggleSubmenu(i)}
              className={`cursor-pointer flex items-center justify-between w-full px-2 py-2 rounded hover:bg-gray-100 transition ${
                !isOpen ? "justify-center" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{item.icon}</span>
                {isOpen && (
                  <span className="text-sm font-semibold">{item.name}</span>
                )}
              </div>

              {item.subname &&
                isOpen &&
                (openMenu === i ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ))}
            </button>

            {/* Submenu (click open for expanded sidebar) */}
            {item.subname && openMenu === i && isOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {item.subname.map((sub, idx) => (
                  <Link
                    key={idx}
                    href={sub.url}
                    className="block px-3 py-1.5 text-sm text-gray-700 rounded transition"
                  >
                    <div className="flex items-center gap-2 font-medium   hover:text-orange-500">
                      {sub.icon}
                      {sub.name}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Submenu (hover for collapsed sidebar) */}
            {!isOpen && item.subname && (
              <div className="absolute left-12 right-2 top-0 z-20 hidden group-hover:block bg-white shadow-sm rounded-sm min-w-[180px] py-2">
                {item.subname.map((sub, idx) => (
                  <Link
                    key={idx}
                    href={sub.url}
                    className="block px-4 py-2 text-sm text-gray-700 transition"
                  >
                    <div className="flex items-center gap-2 hover:text-orange-600">
                      {sub.icon}
                      {sub.name}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
