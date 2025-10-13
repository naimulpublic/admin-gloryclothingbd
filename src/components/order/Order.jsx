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
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList } from "lucide-react";
import Image from "next/image";
import ReactPdfInvoice from "@/custom/invoice/Invoice";
import { MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { View } from "lucide-react";

export default function AdminOrderView({ orderData }) {
  const router = useRouter();
  const [selectedOrders, setSelectedOrders] = useState([]);

  async function updateOrderStatus(orderId, newStatus) {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/api/update/order/${encodeURIComponent(orderId)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message);
      router.refresh();
    }
  }

  const toggleOrderSelection = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const selectAll = selectedOrders.length === orderData.length;

  const toggleSelectAll = () => {
    if (selectAll) setSelectedOrders([]);
    else setSelectedOrders(orderData.map((order) => order._id));
  };

  const ViewInfo = (Ordid) => {
    router.push(`/dashboard/viewdetails/${encodeURIComponent(Ordid)}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-center mb-4 flex items-center gap-2 justify-center">
        <ClipboardList /> Order Management
      </h1>

      <Table>
        <TableCaption>All customer orders listed below</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox checked={selectAll} onCheckedChange={toggleSelectAll} />
            </TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead>View Order</TableHead>
            <TableHead>Update Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orderData.map((order) => (
            <TableRow key={order._id}>
              <TableCell>
                <Checkbox
                  checked={selectedOrders.includes(order._id)}
                  onCheckedChange={() => toggleOrderSelection(order._id)}
                />
              </TableCell>
              <TableCell>{order.orderId}</TableCell>
              <TableCell>
                <div>
                  <p>{order.user.name}</p>
                  <p className="text-sm text-gray-500">{order.user.phone}</p>
                </div>
              </TableCell>
              <TableCell>
                {order.products.map((product, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={30}
                      height={30}
                      className="rounded"
                    />
                    <span>{product.quantity}x</span>
                  </div>
                ))}
              </TableCell>
              <TableCell>৳{order.totalAmount}</TableCell>
              <TableCell>
                <span
                  className={`capitalize px-2 py-1 text-sm rounded font-medium ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.status}
                </span>
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <ReactPdfInvoice order={order} />
              </TableCell>
              <TableCell>
                <button
                  onClick={() => ViewInfo(order.orderId)}
                  className="cursor-pointer flex items-center gap-1 px-2 py-1 text-sm border border-gray-200 rounded-sm hover:bg-gray-100 transition"
                >
                  <View className="w-4 h-4" />
                  Info
                </button>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-full hover:bg-muted transition cursor-pointer">
                      <MoreVertical />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() =>
                        updateOrderStatus(order.orderId, "processing")
                      }
                      className="cursor-pointer hover:bg-muted transition"
                    >
                      Processing
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        updateOrderStatus(order.orderId, "confirmed")
                      }
                      className="cursor-pointer hover:bg-muted transition"
                    >
                      Confirm
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        updateOrderStatus(order.orderId, "shipped")
                      }
                      className="cursor-pointer hover:bg-muted transition"
                    >
                      Shipped
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        updateOrderStatus(order.orderId, "delivered")
                      }
                      className="cursor-pointer hover:bg-muted transition"
                    >
                      Delivered
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        updateOrderStatus(order.orderId, "cancelled")
                      }
                      className="cursor-pointer text-red-600 hover:bg-red-50 transition"
                    >
                      Cancelled
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        updateOrderStatus(order.orderId, "returned")
                      }
                      className="cursor-pointer text-yellow-600 hover:bg-yellow-50 transition"
                    >
                      Returned
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>Total Orders: {orderData.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
