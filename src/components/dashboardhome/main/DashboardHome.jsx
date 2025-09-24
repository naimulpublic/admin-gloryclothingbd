"use client";
import React, { useState } from "react";
import {
  PackageSearch,
  Clock,
  Loader,
  Truck,
  PackageCheck,
  XCircle,
  DollarSign,
  Tag,
  Users,
  Plus,
  CheckCircle,
  ArrowRight,
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
import Link from "next/link";
import { mediumUrl, smallUrl } from "@/static/smallutils/Utils";

export default function DashboardHome({ products,order }) {
  const totalOrders = order?.length || 0;
  const totalRevenue =
    order?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0;
  const totalProducts = products?.length || 0;
  const uniqueCustomers = new Set(order?.map((o) => o.user?.email) || []).size;

  const pendingOrders = order.filter((o) => o.status === "pending").length || 0;
  const processingOrders =
    order.filter((o) => o.status === "processing" || o.status === "confirmed")
      .length || 0;
  const shippedOrders = order.filter((o) => o.status === "shipped").length || 0;
  const returnedOrders =
    order.filter((o) => o.status === "returned").length || 0;

  const deleveredOrders =
    order.filter((o) => o.status === "delivered").length || 0;

  const cancelledOrders =
    order.filter((o) => o.status === "cancelled").length || 0;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: PackageSearch,
      bg: "bg-blue-50",
      ringColor: "ring-blue-200",
      iconColor: "text-blue-600",
      url: "/dashboard/orders",
      period: "All time",
      date: `${order.length} orders placed`,
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      bg: "bg-orange-50",
      ringColor: "ring-orange-200",
      iconColor: "text-orange-600",
      url: "/dashboard/orders/pending",
      period: "Awaiting confirmation",
      date: "Action needed",
    },
    {
      label: "Processing Orders",
      value: processingOrders,
      icon: Loader,
      bg: "bg-yellow-50",
      ringColor: "ring-yellow-200",
      iconColor: "text-yellow-600",
      url: "/dashboard/orders/confirmed,processing",
      period: "Being handled",
      date: "In process",
    },
    {
      label: "Shipped Orders",
      value: shippedOrders,
      icon: Truck,
      bg: "bg-sky-50",
      ringColor: "ring-sky-200",
      iconColor: "text-sky-600",
      url: "/dashboard/orders/shipped",
      period: "On the way",
      date: "Track shipments",
    },
    {
      label: "Delivered Orders",
      value: deleveredOrders,
      icon: PackageCheck, // 📦✅ Delivered
      bg: "bg-green-50",
      ringColor: "ring-green-200",
      iconColor: "text-green-600",
      url: "/dashboard/orders/delivered",
      period: "Successfully delivered",
      date: `${Math.round(
        (deleveredOrders / totalOrders) * 100
      )}% success rate`,
    },
    {
      label: "Cancelled Orders",
      value: cancelledOrders,
      icon: XCircle,
      bg: "bg-red-50",
      ringColor: "ring-red-200",
      iconColor: "text-red-600",
      url: "/dashboard/orders/cancelled",
      period: "Order cancelled",
      date: `${Math.round((cancelledOrders / totalOrders) * 100)}% of total`,
    },
    {
      label: "Total Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      bg: "bg-purple-50",
      ringColor: "ring-purple-200",
      iconColor: "text-purple-600",
      url: "/admin/reports",
      period: "Gross revenue",
      date: "From all orders",
    },
    {
      label: "Total Products",
      value: totalProducts,
      icon: Tag,
      bg: "bg-indigo-50",
      ringColor: "ring-indigo-200",
      iconColor: "text-indigo-600",
      url: "/dashboard/products",
      period: "In inventory",
      date: `${products.filter((p) => p.isFeatured).length} featured`,
    },
    {
      label: "Total Customers",
      value: uniqueCustomers,
      icon: Users,
      bg: "bg-cyan-50",
      ringColor: "ring-cyan-200",
      iconColor: "text-cyan-600",
      url: "/#",
      period: "Unique customers",
      date: "From all orders",
    },
  ];

  const salesData = [
    { name: "Jan", revenue: 0 },
    { name: "Feb", revenue: 0 },
    { name: "Mar", revenue: 0 },
    { name: "Apr", revenue: 0 },
    { name: "May", revenue: 0 },
    { name: "Jun", revenue: 0 },
    { name: "Jul", revenue: 0 },
    { name: "Aug", revenue: totalRevenue },
  ];

  const productPerformanceData = products.map((product) => ({
    name:
      product.name.length > 15
        ? `${product.name.substring(0, 15)}...`
        : product.name,
    sales: order.reduce((sum, o) => {
      const productInOrder = o.products.find(
        (p) => p.productId === product._id
      );
      return sum + (productInOrder ? productInOrder.quantity : 0);
    }, 0),
    revenue: order.reduce((sum, o) => {
      const productInOrder = o.products.find(
        (p) => p.productId === product._id
      );
      return (
        sum +
        (productInOrder ? productInOrder.quantity * productInOrder.price : 0)
      );
    }, 0),
  }));

  return (
    <div className="px-2 lg:px-4 bg-white min-h-screen">
      <h2 className="text-center font-semibold text-md md:text-xl p-2 mb-4 border-b border-gray-300 select-none">
        Dashboard Overview
      </h2>

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
                    <p className="text-sm text-gray-500 hover:underline hover:text-blue-500">
                      {item.label}
                    </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-4">Monthly Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-4">Product Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Units Sold" />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue (৳)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            View all <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.slice(0, 5).map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                    <Link href={`/admin/orders/${order._id}`}>
                      {order.orderId}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ৳{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Top Products</h3>
          <Link
            href="/dashboard/products"
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            View all <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 3).map((product) => {
            const totalSold = order.reduce((sum, o) => {
              const productInOrder = o.products.find(
                (p) => p.productId === product._id
              );
              return sum + (productInOrder ? productInOrder.quantity : 0);
            }, 0);

            return (
              <div
                key={product._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={`${mediumUrl}${
                      product.colorVariants?.[0]?.publicId || ""
                    }`}
                    alt={product.name || ""}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="hover:underline"
                      >
                        {product.name.length > 50
                          ? `${product.name.substring(0, 50)}...`
                          : product.name}
                      </Link>
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      ৳{product.price.toLocaleString()} (MRP: ৳
                      {product.mrp.toLocaleString()})
                    </p>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-gray-600">
                        Sold: {totalSold} units
                      </span>
                      <span
                        className={`font-medium ${
                          product.isFeatured
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {product.isFeatured ? "Featured" : "Regular"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
