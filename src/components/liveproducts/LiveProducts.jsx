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
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical } from "lucide-react";
import { Edit } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import Image from "next/image";
import { mediumUrl } from "@/static/smallutils/Utils";

export default function LiveProducts({ data = [] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  const filteredData = data
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((product) => {
      if (statusFilter === "active" && product.isActive !== true) return false;
      if (statusFilter === "inactive" && product.isActive !== false)
        return false;
      return true;
    })
    .filter((product) => {
      if (featuredFilter === "featured" && !product.isFeatured) return false;
      if (featuredFilter === "non-featured" && product.isFeatured) return false;
      return true;
    });

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredData.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredData.map((product) => product._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete ${selectedProducts.length} products?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/products`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: selectedProducts }),
        }
      );

      const result = await res.json();

      if (result.success) {
        console.log(result.message);
        router.refresh();
        setSelectedProducts([]); // Clear selected products
      } else {
        console.error("Bulk delete failed");
      }
    } catch (error) {
      console.error("Error deleting products:", error);
    }
  };

  const handleEdit = (id) => {
    router.push(`/dashboard/create/product/${id}`);
  };

  const handleSingleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/product/${id}`,
      {
        method: "DELETE",
      }
    );

    const result = await res.json();
    if (res.ok) {
      console.log(result.message);
      router.refresh();
    } else {
      console.error("Failed to delete product:", result.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-center bg-black border border-red-700 rounded-sm py-2 text-white">
        Live Products
      </h2>

      <div className="flex flex-wrap gap-2 justify-between py-2 px-2 mb-6">
        <Input
          className="flex-1 min-w-[200px]"
          placeholder="Search by Product Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="non-featured">Non-Featured</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleBulkDelete}
          variant="destructive"
          disabled={selectedProducts.length === 0}
        >
          Mark Delete ({selectedProducts.length})
        </Button>
      </div>

      <Table>
        <TableCaption>All available products</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">
              <Checkbox
                className={"mr-2"}
                checked={selectedProducts.length === filteredData.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Subcategory</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>MRP</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead>D Color</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredData.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <Checkbox
                  className={"mr-2"}
                  checked={selectedProducts.includes(product._id)}
                  onCheckedChange={() => handleSelectProduct(product._id)}
                />
              </TableCell>
              <TableCell>
                <Image
                  className="w-16 h-16"
                  src={`${mediumUrl}${product?.colorVariants?.[0]?.publicId}`}
                  height={100}
                  width={100}
                  alt="productimage"
                />
              </TableCell>
              <TableCell>
                {product.name.length > 50
                  ? product.name.slice(0, 50) + "..."
                  : product.name}
              </TableCell>
              <TableCell>
                {product.slug.length > 30
                  ? product.slug.slice(0, 30) + "..."
                  : product.slug}
              </TableCell>
              <TableCell>{product.brand.name}</TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell>
                {product.subcategory.map((sub, i) => (
                  <div key={i}>{sub.label}</div>
                ))}
              </TableCell>
              <TableCell>৳{product.price}</TableCell>
              <TableCell>৳{product.mrp}</TableCell>
              <TableCell>
                {product.colorVariants.map((variant, idx) => (
                  <div key={idx}>
                    <span className="font-medium">{variant.colorName}</span> -
                    Q: {variant.quantity}
                  </div>
                ))}
              </TableCell>
              <TableCell>{product.defaultColor}</TableCell>
              <TableCell>{product.isFeatured ? "Yes" : "No"}</TableCell>
              <TableCell>
                {new Date(product.createdAt)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-")
                  .split("-")
                  .map((part, index) => (index === 2 ? part.slice(2) : part))
                  .join("-")}
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer outline-none">
                    <MoreVertical className="cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="cursor-pointer">
                    <DropdownMenuItem
                      onClick={() => handleEdit(product._id)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-600"
                    >
                      <Edit className="text-blue-600" size={14} /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSingleDelete(product._id)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-600"
                    >
                      <Trash2 className="text-red-600" size={14} /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={14}>
              Total Products: <strong>{filteredData.length}</strong>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
