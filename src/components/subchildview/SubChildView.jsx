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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubChildView({ subchild }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubChild, setSelectedSubChild] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter Logic
  const filteredSubChild = subchild.filter((child) => {
    const matchesSearch = child.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? child.isActive
        : !child.isActive;
    return matchesSearch && matchesStatus;
  });

  // Bulk Delete Handler
  const handleBulkDelete = async () => {
    if (selectedSubChild.length === 0) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete ${selectedSubChild.length} SubChilds?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/delete/subchilds`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: selectedSubChild }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete SubChilds");

      // Remove deleted SubChilds from state
      alert("SubChilds deleted successfully");
      router.refresh();
      setSelectedSubChild([]);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting SubChilds");
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckbox = (id) => {
    if (selectedSubChild.includes(id)) {
      setSelectedSubChild(selectedSubChild.filter((item) => item !== id));
    } else {
      setSelectedSubChild([...selectedSubChild, id]);
    }
  };

  const handleEdit = (id) => {
    router.push(`/dashboard/create/subcategorieschild/${id}`);
  };

  const handleSingleDelete = async (id) => {
    if (!confirm("Are you sure? Delete this SubChild?")) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/delete/subchild/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete SubChild");

      alert("SubChild deleted successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting SubChild");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Filter & Actions */}
      <div className="flex flex-wrap gap-2 justify-between py-2 px-4">
        <Input
          className="flex-1 min-w-[200px]"
          placeholder="Search by Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] cursor-pointer">
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
          disabled={selectedSubChild.length === 0 || loading}
          variant="destructive"
        >
          {loading ? "Deleting..." : `Mark Delete (${selectedSubChild.length})`}
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableCaption className="text-green-500">
          List of SubCategory Children
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                className="cursor-pointer"
                checked={
                  selectedSubChild.length === filteredSubChild.length &&
                  filteredSubChild.length > 0
                }
                onCheckedChange={() => {
                  if (selectedSubChild.length === filteredSubChild.length) {
                    setSelectedSubChild([]);
                  } else {
                    setSelectedSubChild(
                      filteredSubChild.map((item) => item._id)
                    );
                  }
                }}
              />
            </TableHead>
            <TableHead>Baner Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>

            <TableHead>Date</TableHead>
            <TableHead>updated Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubChild.map((child) => (
            <TableRow key={child._id}>
              <TableCell>
                <Checkbox
                  checked={selectedSubChild.includes(child._id)}
                  onCheckedChange={() => toggleCheckbox(child._id)}
                />
              </TableCell>
              <TableCell>
                <img
                  src={child.bannerUrl}
                  alt={child.name}
                  className="w-20 h-10 rounded-md object-cover border"
                />
              </TableCell>
              <TableCell>{child.name}</TableCell>
              <TableCell>{child.slug}</TableCell>
              <TableCell>
                {new Date(child.createdAt)
                  .toLocaleDateString("en-US", {
                    year: "2-digit",
                    month: "numeric",
                    day: "numeric",
                  })
                  .replace(/\//g, "-")}
              </TableCell>
              <TableCell>
                {child.updatedAt
                  ? new Date(child.updatedAt)
                      .toLocaleDateString("en-US", {
                        year: "2-digit",
                        month: "numeric",
                        day: "numeric",
                      })
                      .replace(/\//g, "-")
                  : "Not Updated Yet"}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(child._id)}>
                      <Edit className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSingleDelete(child._id)}
                      className="text-red-600"
                    >
                      <Trash className="mr-2" />
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
            <TableCell colSpan={7}>
              Total SubChild: {filteredSubChild.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
