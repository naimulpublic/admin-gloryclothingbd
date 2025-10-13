"use client";
import React, { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, MoreVertical, Loader } from "lucide-react";

import { toast } from "react-toastify";
import { Edit } from "lucide-react";
import Image from "next/image";
import { mediumUrl } from "@/static/smallutils/Utils";

export default function CategoriesPage({ categories }) {
  let router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState(""); // Default empty, shows all categories
  const [selectedCategories, setSelectedCategories] = useState([]);

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter && statusFilter !== "all"
        ? category.status === statusFilter
        : true;

    return matchesSearch && matchesStatus;
  });

  const handleSelectCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleBulkAction = async () => {
    if (!confirm("Are you sure?? you want to delete bulk category??")) return;

    setLoading(true);

    if (selectedCategories.length === 0) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/categorys`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedCategories }),
      }
    );

    setLoading(false);
    if (res.ok) {
      toast.success("Selected subcategory deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete selected subcategory");
    }
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map((category) => category._id));
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure?? you want to delete category??"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/category/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Category deleted successfully.");
        router.refresh();
      } else {
        alert("Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category.");
    }
  };

  const handleEdit = (id) => {
    router.push(`/dashboard/create/categories/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold border-b pb-2 mb-8 text-center">
        Categories Management
      </h1>

      {/* Search and Filter */}
      <div className="flex justify-between mb-4">
        <Input
          className={"w-1/2"}
          type="text"
          placeholder="Search by Category Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={handleBulkAction}
          disabled={selectedCategories.length === 0 || loading}
          className="flex items-center bg-black text-white py-2 px-4 rounded-md  disabled:cursor-not-allowed text-sm font-semibold cursor-pointer"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            "Mark Delete"
          )}
        </button>
      </div>

      <Table>
        <TableCaption className={"text-green-500"}>
          A list of all categories
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                className="cursor-pointer size-5 mr-2"
                checked={
                  selectedCategories.length === filteredCategories.length
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>

            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Subcategories</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCategories.map((category) => (
            <TableRow key={category._id}>
              <TableCell>
                <Checkbox
                  className="cursor-pointer size-5"
                  checked={selectedCategories.includes(category._id)}
                  onCheckedChange={() => handleSelectCategory(category._id)}
                />
              </TableCell>

              <TableCell>
                <Image
                  className="h-16 w-14"
                  src={`${mediumUrl}${category.imagePublicId}`}
                  alt="category image"
                  height={100}
                  width={100}
                />
              </TableCell>

              <TableCell>{category.name}</TableCell>
              <TableCell>{category.slug}</TableCell>

              <TableCell>
                {category.status === "active" ? (
                  <span className="text-green-600 font-semibold">Active</span>
                ) : (
                  <span className="text-red-500 font-semibold">Inactive</span>
                )}
              </TableCell>
              <TableCell>{category.priority}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer outline-none">
                    {category.subcategories.length} Subcategories
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {category.subcategories.map((subcat) => (
                      <DropdownMenuItem key={subcat.slug}>
                        {subcat.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      type="button"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-300 cursor-pointer" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-40 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-1"
                  >
                    <DropdownMenuItem
                      onClick={() => handleEdit(category._id)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md transition-colors"
                    >
                      <Edit className="h-4 w-4 text-blue-500" />
                      <span className="text-blue-500 dark:text-gray-200 font-medium">
                        Edit
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(category._id)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        Delete
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>
              Total Categories:{" "}
              <span className="text-red-500">{filteredCategories.length}</span>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
