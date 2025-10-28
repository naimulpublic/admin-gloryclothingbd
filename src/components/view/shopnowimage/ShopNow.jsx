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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { mediumUrl } from "@/static/smallutils/Utils";

export default function ViewShopNowImage({ Slider }) {
  const router = useRouter();
  const [sliderList, setSliderList] = useState(Slider);
  const [selectedSliders, setSelectedSliders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSliders = useMemo(() => {
    return sliderList.filter((sliderItem) => {
      const matchesSearch = sliderItem.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || sliderItem.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sliderList, search, statusFilter]);

  const handleSelectAll = () => {
    if (selectedSliders.length === filteredSliders.length) {
      setSelectedSliders([]);
    } else {
      setSelectedSliders(filteredSliders.map((slider) => slider._id));
    }
  };

  const handleSelectSlider = (id) => {
    setSelectedSliders((prev) =>
      prev.includes(id)
        ? prev.filter((sliderId) => sliderId !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedSliders.length === 0) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete ${selectedSliders.length} sliders?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/shopnowimages`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: selectedSliders }),
        }
      );

      const result = await res.json();
      if (res.ok) {
        console.log(result.message);
        setSliderList((prev) =>
          prev.filter((slider) => !selectedSliders.includes(slider._id))
        );
        setSelectedSliders([]);
      } else {
        console.error("Failed to delete sliders:", result.message);
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
    }
  };

  const handleSingleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this shop now image?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/shopnowimage/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await res.json();
      if (res.ok) {
        console.log(result.message);
        setSliderList((prev) => prev.filter((slider) => slider._id !== id));
        setSelectedSliders((prev) =>
          prev.filter((sliderId) => sliderId !== id)
        );
      } else {
        console.error("Failed to delete slider:", result.message);
      }
    } catch (error) {
      console.error("Single delete error:", error);
    }
  };

  const handleEditSlider = (id) => {
    router.push(`/dashboard/create/shopimage/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold border-b pb-2 mb-8 text-center">
        Slider Management
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4 mb-4 justify-between">
        <Input
          className="flex-1 min-w-[200px]"
          placeholder="Search by Slider Name"
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

      <Table>
        <TableCaption className="text-green-500">
          A list of all sliders
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={
                  filteredSliders.length > 0 &&
                  selectedSliders.length === filteredSliders.length
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Sliders</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right pr-20">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredSliders.length > 0 ? (
            filteredSliders.map((slider) => (
              <TableRow key={slider._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedSliders.includes(slider._id)}
                    onCheckedChange={() => handleSelectSlider(slider._id)}
                  />
                </TableCell>
                <TableCell>{slider.name}</TableCell>
                <TableCell>
                  <Image
                    src={`${mediumUrl}${slider.publicId}`}
                    alt={slider.name}
                    width={200}
                    height={200}
                    className="w-36 h-14 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell>{slider.isActive ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => handleEditSlider(slider._id)}
                      variant="outline"
                      className="cursor-pointer"
                    >
                      <Edit className="" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleSingleDelete(slider._id)}
                      variant="outline"
                      className={"cursor-pointer"}
                    >
                      <Trash className="" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No sliders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>
              Total Sliders:{" "}
              <span className="font-bold text-red-500">
                {filteredSliders.length}
              </span>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
