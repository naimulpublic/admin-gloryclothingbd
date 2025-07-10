"use client";
import React, { useState, useMemo } from "react";
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
import { Checkbox } from "../ui/checkbox";
import { EllipsisVertical, View, SquarePen, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

export default function CuponView({ cupon }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSliders, setSelectedSliders] = useState([]);

  // ✅ Filtered & searched coupons
  const filteredCoupons = useMemo(() => {
    return cupon.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? item.isActive
          : !item.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [cupon, search, statusFilter]);


  const toggleSelect = (id) => {
    setSelectedSliders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handelDelete = async (id) => {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/delete/coupon/${id}`,
      {
        method: "DELETE",
      }
    );
    const response = await request.json();

    if (request.ok) {
      alert("Coupon deleted successfully.");
      router.refresh();
    }
  };
  const handleEdit = (id) => {
    router.push(`/dashboard/admin/create/cupon/${id}`);
  };

  const handleBulkDelete = async () => {
    if (selectedSliders.length === 0) return;
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/delete/coupons`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedSliders }),
      });
  
      const result = await res.json();
      if (res.ok) {
        console.log(result.message);
        router.refresh(); // ✅ ডেটা রিফ্রেশ করার জন্য যথেষ্ট
        setSelectedSliders([]); // ✅ সিলেকশন ক্লিয়ার
      } else {
        console.error("Failed to delete coupons:", result.message);
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
    }
  };
  

  return (
    <>
      <h1 className="text-xl font-medium text-center mb-6  p-4 border-b pb-2">
        Cupon ManageMents
      </h1>
      {/* Search & Filter */}
      <div className="flex flex-wrap gap-2 justify-between py-2 px-6">
        <Input
          className="flex-1 min-w-[200px]"
          placeholder="Search by Coupon Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleBulkDelete}
          disabled={selectedSliders.length === 0}
          variant="destructive"
        >
          Mark Delete ({selectedSliders.length})
        </Button>
      </div>

      {/* Table */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <Table>
          <TableCaption>Coupon List</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  className="cursor-pointer"
                  checked={
                    selectedSliders.length === filteredCoupons.length &&
                    filteredCoupons.length > 0
                  }
                  onCheckedChange={() => {
                    if (selectedSliders.length === filteredCoupons.length) {
                      setSelectedSliders([]);
                    } else {
                      setSelectedSliders(
                        filteredCoupons.map((item) => item._id)
                      );
                    }
                  }}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Coupon Code</TableHead>
              <TableHead>Discount (%)</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCoupons.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Checkbox
                    className="cursor-pointer"
                    checked={selectedSliders.includes(item._id)}
                    onCheckedChange={() => toggleSelect(item._id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.cuponCode}</TableCell>
                <TableCell>{item.discountPercentage}%</TableCell>
                <TableCell>
                  {new Date(item.expiryDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {item.isActive ? (
                    <span className="text-green-500 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inactive</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVertical className="cursor-pointer" strokeWidth={1}/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                        <View />
                        View
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleEdit(item._id)}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        <SquarePen />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handelDelete(item._id)}
                      >
                        <Trash />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan="7">
                Total Coupons: {filteredCoupons.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
