"use client";
import React, { useEffect, useState } from "react";
import { Menu } from "../../../static/Menu";
import Link from "next/link";
import { ArrowLeftToLine, ChevronDown, ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setIsOpen(window.innerWidth >= 800);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const toggleSubmenu = (key) => {
    setOpenMenu(openMenu === key ? null : key);
  };

  return (
    <aside
      className={`${
        isOpen ? "w-48 xl:w-52" : "w-14 xl:w-20"
      } h-screen overflow-y-auto 
      bg-white border-r border-gray-100 shadow-sm 
      transition-all duration-300 ease-in-out relative`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end pr-2 pt-3">
        <ArrowLeftToLine
          onClick={() => setIsOpen(!isOpen)}
          className={`cursor-pointer text-gray-500 hover:text-orange-500 
          transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Navigation */}
      <nav className="mt-5 space-y-4 px-1">
        {Menu.map((section, sIdx) => (
          <div key={sIdx}>
            {isOpen && (
              <h3 className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wide">
                {section.section}
              </h3>
            )}

            {section.items.map((item, i) => {
              const key = `${sIdx}-${i}`;
              const isActive = pathname === item.url;

              return (
                <div key={key} className="relative group w-full">
                  <button
                    onClick={() => toggleSubmenu(key)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md 
                      transition-all duration-200 ${
                        isActive
                          ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500"
                          : "hover:bg-gray-100 text-gray-700"
                      } ${!isOpen ? "justify-center" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`${
                          isActive ? "text-orange-600" : "text-gray-500"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {isOpen && (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                    </div>

                    {item.subname &&
                      isOpen &&
                      (openMenu === key ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ))}
                  </button>

                  {/* Submenu Expanded */}
                  {item.subname && openMenu === key && isOpen && (
                    <div className="ml-4 mt-1 space-y-1 animate-slideDown">
                      {item.subname.map((sub, idx) => {
                        const isSubActive = pathname === sub.url;
                        return (
                          <Link
                            key={idx}
                            href={sub.url}
                            className={`block px-2 py-1.5 text-sm rounded-l-md transition ${
                              isSubActive
                                ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500"
                                : "text-gray-600 hover:text-orange-500"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {sub.icon}
                              {sub.name}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Submenu Hover (collapsed) */}
                  {!isOpen && item.subname && (
                    <div
                      className="absolute left-14 top-0 z-20 hidden group-hover:block 
                      bg-white shadow-lg rounded-md min-w-[180px] py-2 border border-gray-100"
                    >
                      {item.subname.map((sub, idx) => (
                        <Link
                          key={idx}
                          href={sub.url}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-orange-600 transition"
                        >
                          <div className="flex items-center gap-2">
                            {sub.icon}
                            {sub.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
