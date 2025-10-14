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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { mediumUrl } from "@/static/smallutils/Utils";


export default function BrandView({ brandData }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBrands = brandData.filter((brand) => {
    const matchesSearch = brand.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFeatured =
      featuredFilter === "all" ||
      (featuredFilter === "yes" && brand.isFeatured) ||
      (featuredFilter === "no" && !brand.isFeatured);
    const matchesStatus =
      statusFilter === "all" || brand.status === statusFilter;

    return matchesSearch && matchesFeatured && matchesStatus;
  });

  const handleCheckboxChange = (id) => {
    const updatedSelectedBrands = selectedBrands.includes(id)
      ? selectedBrands.filter((item) => item !== id)
      : [...selectedBrands, id];

    setSelectedBrands(updatedSelectedBrands);

    // Check if all brands are selected
    setIsAllSelected(updatedSelectedBrands.length === filteredBrands.length);
  };
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedBrands([]); // Unselect all
    } else {
      setSelectedBrands(filteredBrands.map((brand) => brand._id)); // Select all
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleEdit = (id) => {
    router.push(`/dashboard/create/brand/${id}`);
  };

  const handleDelete = (id) => {
    const request = fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/brand/${id}`,
      {
        method: "DELETE",
      }
    );
    request.then((res) => res.json());
    router.refresh();
  };

  const handleBulkDelete = async () => {
    if (selectedBrands.length === 0) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/brands`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: selectedBrands }),
        }
      );

      const result = await response.json();

      if (result.success) {
        router.refresh(); // Refresh the brand list
        setSelectedBrands([]);
        setIsAllSelected(false);
      } else {
        console.error(result.message || "Failed to delete brands");
      }
    } catch (error) {
      console.error("Error during bulk delete:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-medium text-center mb-6 p-4 border-b pb-2">
        Brand Management
      </h1>

      <div className="flex flex-wrap gap-2 justify-between py-2 px-2 mb-4">
        <Input
          className="flex-1 min-w-[200px]"
          placeholder="Search by Brand Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter by Featured */}
        <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
          <SelectTrigger className="min-w-[120px] p-2 border rounded">
            <SelectValue placeholder="All Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Featured</SelectItem>
            <SelectItem value="yes">Featured</SelectItem>
            <SelectItem value="no">Not Featured</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter by Status */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="min-w-[120px] p-2 border rounded">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleBulkDelete}
          disabled={selectedBrands.length === 0}
          variant="destructive"
        >
          Delete ({selectedBrands.length})
        </Button>
      </div>

      <Table>
        <TableCaption>All brands listed below</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Brand Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBrands.map((brand) => (
            <TableRow key={brand._id}>
              <TableCell>
                <Checkbox
                  checked={selectedBrands.includes(brand._id)}
                  onCheckedChange={() => handleCheckboxChange(brand._id)}
                />
              </TableCell>
              <TableCell>
                <Image
                  src={`${mediumUrl}${brand.imagePublicId}`}
                  alt={brand.name}
                  width={200}
                  height={200}
                  className="h-14 w-14 rounded-xs"
                />
              </TableCell>
              <TableCell>{brand.name}</TableCell>
              <TableCell>{brand.slug}</TableCell>
              <TableCell>{brand.isFeatured ? "Yes" : "No"}</TableCell>
              <TableCell
                className={
                  brand.status === "active" ? "text-green-600" : "text-red-500"
                }
              >
                {brand.status}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Edit
                    size={18}
                    className="text-blue-600 cursor-pointer hover:scale-110"
                    onClick={() => handleEdit(brand._id)}
                  />
                  <Trash2
                    size={18}
                    className="text-red-600 cursor-pointer hover:scale-110"
                    onClick={() => handleDelete(brand._id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>
              Total Brands: {filteredBrands.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
