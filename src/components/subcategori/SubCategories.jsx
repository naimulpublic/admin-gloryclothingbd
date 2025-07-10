"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SubcategoryTable = ({ subcategori }) => {
  const [subcategories, setSubcategories] = useState(subcategori || []);
  const [selectedLabel, setSelectedLabel] = useState("All");
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const router = useRouter();
  
  // Reference to the dropdown menu
  const menuRef = useRef(null);

  // Unique label list generate
  const labels = useMemo(() => {
    const allLabels = subcategories.map((item) => item.label);
    return ["All", ...Array.from(new Set(allLabels))];
  }, [subcategories]);

  // Filter by selected label
  const filteredSubcategories = useMemo(() => {
    if (selectedLabel === "All") return subcategories;
    return subcategories.filter((item) => item.label === selectedLabel);
  }, [subcategories, selectedLabel]);

  const handleEdit = (item) => {
    router.push(`/dashboard/create/subcategories/${item._id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/delete/subcategory/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete");

      const filtered = subcategories.filter((item) => item._id !== id);
      setSubcategories(filtered);
      alert("Subcategory deleted successfully!");
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
      alert("Failed to delete subcategory.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = (id) => {
    if (openMenu === id) {
      setOpenMenu(null);
    } else {
      setOpenMenu(id);
    }
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-center border-b pb-2">
        Manage Subcategories
      </h2>

      {/* Dropdown for Filtering */}
      <div className="mb-4">
        <select
          className="border rounded px-3 py-2"
          value={selectedLabel}
          onChange={(e) => setSelectedLabel(e.target.value)}
        >
          {labels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Shadcn Table */}
      <div className="rounded-md border">
        <Table>
          <TableCaption className={"text-green-600"}>A list of your subcategories.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Banner</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubcategories.map((item) => (
              <TableRow key={item._id} className="relative">
                <TableCell>{item.label}</TableCell>
                <TableCell>{item.value}</TableCell>
                <TableCell>{item.slug}</TableCell>
                <TableCell>
                  {item.isActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inactive</span>
                  )}
                </TableCell>
                <TableCell>
                  <img
                    src={item.bannerUrl}
                    alt="Banner"
                    className="h-12 w-24 object-cover rounded"
                  />
                </TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex gap-2 items-center">
                  {/* 3-dot (More Options) Button */}
                  <button
                    onClick={() => toggleMenu(item._id)}
                    className="cursor-pointer flex items-center justify-center text-sm p-2 rounded hover:bg-gray-100"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {/* Conditional Rendered Action Buttons */}
                  {openMenu === item._id && (
                    <div
                      ref={menuRef}
                      className="absolute bg-white border rounded shadow-md mt-2 w-32"
                    >
                      <button
                        onClick={() => handleEdit(item)}
                        className="cursor-pointer flex items-center gap-2 px-3 py-2 w-full text-left text-blue-600 hover:bg-gray-100"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="cursor-pointer flex items-center gap-2 px-3 py-2 w-full text-left text-red-600 hover:bg-gray-100"
                        disabled={loading}
                      >
                        {loading ? "Deleting..." : <Trash2 size={14} />} Delete
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total Subcategories</TableCell>
              <TableCell>{filteredSubcategories.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default SubcategoryTable;
