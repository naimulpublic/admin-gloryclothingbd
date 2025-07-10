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
import { MoreHorizontal, Edit, Trash, Download } from "lucide-react"; // Importing icons from lucide-react
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

export default function CategoriesPage({ categories }) {
  let router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Default empty, shows all categories
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Filter categories based on search text and status
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter
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

  const handleBulkAction = (action) => {
    // Handle bulk actions (edit, delete) here based on selected categories
    console.log(`Performing ${action} on categories: ${selectedCategories}`);
  };

  // Select All Checkbox Handler
  const handleSelectAll = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]); // Deselect all if all are selected
    } else {
      setSelectedCategories(filteredCategories.map((category) => category._id));
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Do you delete this category??");

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/delete/category/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Category deleted successfully.");
        router.refresh();
      } else {
        alert("Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category.");
    }
  };

  const handleEdit = (id)=>{
    router.push(`/dashboard/create/categories${id}`);
  }

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

        <Button
          onClick={() => handleBulkAction("delete")}
          disabled={selectedCategories.length === 0}
        >
          Mark Delete
        </Button>
      </div>

      <Table>
        <TableCaption className={"text-green-500"}>
          A list of all categories
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={
                  selectedCategories.length === filteredCategories.length
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>

            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Subcategories</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCategories.map((category) => (
            <TableRow key={category._id}>
              <TableCell>
                <Checkbox
                  checked={selectedCategories.includes(category._id)}
                  onCheckedChange={() => handleSelectCategory(category._id)}
                />
              </TableCell>

              <TableCell>{category.name}</TableCell>
              <TableCell>{category.slug}</TableCell>

              {category.status ? (
                <span className="text-green-600 font-semibold">Active</span>
              ) : (
                <span className="text-red-500 font-semibold">Inactive</span>
              )}

              <TableCell>{category.priority}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer outline-none">
                    {category.subcategories.length} Subcategories
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {category.subcategories.map((subcat) => (
                      <DropdownMenuItem key={subcat.slug}>
                        {subcat.value}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <MoreHorizontal className="cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(category._id)}>
                        <Edit className="mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(category._id)}
                      >
                        <Trash className="mr-2" /> Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2" /> Import
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
