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

export default function RootAdmin({ rootAdmin }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSliders, setSelectedSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState(rootAdmin); // Local state for admins

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = admin.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? admin.isActive
        : !admin.isActive;
    return matchesSearch && matchesStatus;
  });

  const handleBulkDelete = async () => {
    if (selectedSliders.length === 0) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete ${selectedSliders.length} admins?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);

      // Send DELETE request to backend for bulk deletion
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/admins`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: selectedSliders }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete admins");

      // Remove the deleted admins from the state
      setAdmins((prev) =>
        prev.filter((admin) => !selectedSliders.includes(admin._id))
      );
      setSelectedSliders([]); // Clear selected sliders
      alert("Admins deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting admins");
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckbox = (id) => {
    if (selectedSliders.includes(id)) {
      setSelectedSliders(selectedSliders.filter((item) => item !== id));
    } else {
      setSelectedSliders([...selectedSliders, id]);
    }
  };

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/create/admin/${id}`);
  };

  const handleSingleDelete = async (id) => {
    if (!confirm("Are you sure?? Delete this Root Admin?")) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/admin/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete admin");

      // Remove the deleted admin from state
      setAdmins((prev) => prev.filter((admin) => admin._id !== id));
      setSelectedSliders((prev) => prev.filter((adminId) => adminId !== id));
      alert("Admin deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting");
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
          disabled={selectedSliders.length === 0 || loading}
          variant="destructive"
        >
          {loading ? "Deleting..." : `Mark Delete (${selectedSliders.length})`}
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableCaption className="text-green-500">
          List of Root Admins
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                className="cursor-pointer"
                checked={
                  selectedSliders.length === filteredAdmins.length &&
                  filteredAdmins.length > 0
                }
                onCheckedChange={() => {
                  if (selectedSliders.length === filteredAdmins.length) {
                    setSelectedSliders([]);
                  } else {
                    setSelectedSliders(filteredAdmins.map((item) => item._id));
                  }
                }}
              />
            </TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Admin</TableHead>

            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAdmins.map((admin) => (
            <TableRow key={admin._id}>
              <TableCell>
                <Checkbox
                  checked={selectedSliders.includes(admin._id)}
                  onCheckedChange={() => toggleCheckbox(admin._id)}
                />
              </TableCell>
              <TableCell>
                <img
                  src={admin.imageUrl}
                  alt={admin.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </TableCell>
              <TableCell>{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>{admin.adminRole}</TableCell>

              <TableCell>
                {new Date(admin.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(admin._id)}>
                      <Edit className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSingleDelete(admin._id)}
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
              Total Admins: {filteredAdmins.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
