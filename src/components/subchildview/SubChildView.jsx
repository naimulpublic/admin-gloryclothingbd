"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { Edit } from "lucide-react";

export default function SubCategoriChild({ subcategorychild }) {
  const router = useRouter();
  const [data, setData] = useState(
    Array.isArray(subcategorychild) ? subcategorychild : []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const filteredSubcategories = useMemo(() => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  // ✅ Handle Edit
  const handleEdit = (id) => {
    router.push(`/dashboard/create/subcategorychild/${id}`);
  };

  // ✅ Handle Single Delete (with instant state update)
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?? Delete this Subcategory Child??")) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/subcategorychild/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const response = await res.json();

    if (res.ok) {
      toast.success(response.message);

      setData((prev) => prev.filter((item) => item._id !== id));
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
    } else {
      toast.error("Failed to delete subcategory");
    }
  };

  // ✅ Handle Bulk Delete (with instant state update)
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm("Are you sure you want to delete these subcategorychild?"))
      return;

    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/delete/subcategorychilds`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      }
    );

    setLoading(false);
    if (res.ok) {
      toast.success("Selected subcategorychild deleted");
      // ✅ Remove deleted items from state
      setData((prev) => prev.filter((item) => !selectedIds.includes(item._id)));
      setSelectedIds([]);
    } else {
      toast.error("Failed to delete selected subcategorychild");
    }
  };

  // ✅ Toggle Select All
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSubcategories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubcategories.map((item) => item._id));
    }
  };

  // ✅ Toggle Single Item
  const toggleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-medium text-center py-2 mb-4 shadow-md">
        Manage subcategorychild
      </h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <Input
          placeholder="Search subcategories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <Button
          variant="destructive"
          onClick={handleBulkDelete}
          disabled={loading || selectedIds.length === 0}
          className="ml-auto"
        >
          {loading ? "Deleting..." : `Delete (${selectedIds.length})`}
        </Button>
      </div>

    
      <div className="rounded-md border p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    filteredSubcategories.length > 0 &&
                    selectedIds.length === filteredSubcategories.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Banner</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubcategories.length > 0 ? (
              filteredSubcategories.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(item._id)}
                      onCheckedChange={() => toggleSelectItem(item._id)}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.slug}</TableCell>
                  <TableCell>
                    {item.banner && (
                      <img
                        src={item.banner}
                        alt="Banner"
                        className="h-10 w-16 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
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
                          onClick={() => handleEdit(item._id)}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md transition-colors"
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                          <span className="text-blue-500 dark:text-gray-200 font-medium">
                            Edit
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(item._id)}
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No subcategories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-green-600" colSpan={6}>
                Total: {filteredSubcategories.length} subcategories
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
