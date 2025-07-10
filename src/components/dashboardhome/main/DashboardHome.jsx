"use client";
import React, { useState } from "react";
import {
  PackageSearch,
  Truck,
  PackageCheck,
  XCircle,
  DollarSign,
  Users,
  Plus,
  Tag,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Loader } from "lucide-react";
import { Activity } from "lucide-react";
import Link from "next/link";

// S - Stats
const stats = [
  {
    label: "Pending Orders",
    url: "/dashboard/orders/pending",
    value: 14,
    date: "23 April 2025",
    period: "Today",
    icon: PackageSearch,
    bg: "bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300",
    iconColor: "text-orange-600",
    ringColor: "ring-orange-300",
  },
  {
    label: "Processing Orders",
    url: "/orders/processing",
    value: 12,
    date: "23 April 2025",
    period: "Today",
    icon: Loader,
    bg: "bg-gradient-to-r from-cyan-100 via-cyan-200 to-cyan-300",
    iconColor: "text-cyan-600",
    ringColor: "ring-cyan-300",
  },
  {
    label: "Shipped Orders",
    url: "/orders/shipped",
    value: 9,
    date: "23 April 2025",
    period: "Today",
    icon: Truck,
    bg: "bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300",
    iconColor: "text-yellow-600",
    ringColor: "ring-yellow-300",
  },
  {
    label: "Delivered Orders",
    url: "/orders/delivered",
    value: 31,
    date: "23 April 2025",
    period: "Today",
    icon: PackageCheck,
    bg: "bg-gradient-to-r from-green-100 via-green-200 to-green-300",
    iconColor: "text-green-600",
    ringColor: "ring-green-300",
  },
  {
    label: "Cancelled Orders",
    url: "/orders/cancelled",
    value: 2,
    date: "23 April 2025",
    period: "Today",
    icon: XCircle,
    bg: "bg-gradient-to-r from-red-100 via-red-200 to-red-300",
    iconColor: "text-red-600",
    ringColor: "ring-red-300",
  },
  {
    label: "Live Products",
    url: "/dashboard/products/live",
    value: 20,
    date: "23 April 2025",
    period: "Today",
    icon: Activity,
    bg: "bg-gradient-to-r from-purple-100 via-purple-200 to-pink-300",
    iconColor: "text-pink-600",
    ringColor: "ring-pink-300",
  },
  {
    label: "New Customers",
    url: "/customers/new",
    value: 152,
    date: "23 April 2025",
    period: "Today",
    icon: Users,
    bg: "bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-300",
    iconColor: "text-indigo-600",
    ringColor: "ring-indigo-300",
  },
  {
    label: "Revenue",
    url: "/sales/revenue",
    value: "$6,870",
    date: "23 April 2025",
    period: "Last 30 Days",
    icon: DollarSign,
    bg: "bg-gradient-to-r from-teal-100 via-teal-200 to-teal-300",
    iconColor: "text-teal-600",
    ringColor: "ring-teal-300",
  },
];

// A - Analytics
const orderData = [
  { week: "Week 1", orders: 10 },
  { week: "Week 2", orders: 18 },
  { week: "Week 3", orders: 32 },
  { week: "Week 4", orders: 24 },
];

const revenueData = [
  { month: "Jan", revenue: 3200 },
  { month: "Feb", revenue: 4100 },
  { month: "Mar", revenue: 5500 },
  { month: "Apr", revenue: 6870 },
];

// S - Sales
const initialOrders = [
  { id: "ORD001", customer: "Naimul Islam", status: "Pending", payment: "COD" },
  {
    id: "ORD002",
    customer: "Tanvir Hasan",
    status: "Shipped",
    payment: "Card",
  },
  {
    id: "ORD003",
    customer: "Sara Rahman",
    status: "Delivered",
    payment: "Paypal",
  },
];

const quickActions = [
  { label: "Add Product", icon: Plus },
  { label: "Create Coupon", icon: Tag },
  { label: "Approve Review", icon: CheckCircle },
];

export default function DashboardHome() {
  const [recentOrders, setRecentOrders] = useState(initialOrders);

  // Function to change order status
  const changeStatus = (orderId, newStatus) => {
    setRecentOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="p-2 lg:p-4 bg-gray-100 min-h-screen">
      <h2 className="ml-4 text-xl xl:text-2xl font-medium xl:font-semibold mb-4 xl:mb-8 text-gray-800">
        Dashboard Overview
      </h2>

      {/* S - Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 xl:gap-4 mb-4 xl:mb-8">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex flex-col justify-between p-4 xl:p-6 h-44 rounded-xl shadow-sm border ${item.bg} hover:shadow-md transition-all duration-300`}
            >
              <Link href={item.url}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 hover:underline hover:text-blue-500">{item.label}</p>
                    <h3 className="text-3xl font-bold text-gray-800">
                      {item.value}
                    </h3>
                  </div>
                  <div
                    className={`rounded-full p-2 ring-2 ${item.ringColor} ${item.iconColor} bg-white`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                </div>
                <div className="pt-3">
                  <p className="text-xs text-gray-500">{item.period}</p>
                  <p className="text-sm text-gray-600 font-medium">
                    {item.date}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      
    </div>
  );
}
