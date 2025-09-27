"use client";
import React from "react";
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
  ArrowRight,
} from "lucide-react";

import Link from "next/link";
import { mediumUrl } from "@/static/smallutils/Utils";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardHome({ products, order }) {
  // Stats calculation
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
  const deliveredOrders =
    order.filter((o) => o.status === "delivered").length || 0;
  const cancelledOrders =
    order.filter((o) => o.status === "cancelled").length || 0;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: PackageSearch,
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      ringColor: "ring-blue-200",
      iconColor: "text-blue-600",
      url: "/dashboard/orders",
      period: "All time",
      date: `${totalOrders} orders placed`,
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      bg: "bg-gradient-to-br from-orange-50 to-orange-100",
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
      bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
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
      bg: "bg-gradient-to-br from-sky-50 to-sky-100",
      ringColor: "ring-sky-200",
      iconColor: "text-sky-600",
      url: "/dashboard/orders/shipped",
      period: "On the way",
      date: "Track shipments",
    },
    {
      label: "Delivered Orders",
      value: deliveredOrders,
      icon: PackageCheck,
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      ringColor: "ring-green-200",
      iconColor: "text-green-600",
      url: "/dashboard/orders/delivered",
      period: "Successfully delivered",
      date: totalOrders
        ? `${Math.round((deliveredOrders / totalOrders) * 100)}% success rate`
        : "0%",
    },
    {
      label: "Cancelled Orders",
      value: cancelledOrders,
      icon: XCircle,
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      ringColor: "ring-red-200",
      iconColor: "text-red-600",
      url: "/dashboard/orders/cancelled",
      period: "Order cancelled",
      date: totalOrders
        ? `${Math.round((cancelledOrders / totalOrders) * 100)}% of total`
        : "0%",
    },
    {
      label: "Total Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
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
      bg: "bg-gradient-to-br from-indigo-50 to-indigo-100",
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
      bg: "bg-gradient-to-br from-cyan-50 to-cyan-100",
      ringColor: "ring-cyan-200",
      iconColor: "text-cyan-600",
      url: "/#",
      period: "Unique customers",
      date: "From all orders",
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { boxWidth: 20, padding: 15 } },
      tooltip: { mode: "index", intersect: false, padding: 10 },
    },
    interaction: { mode: "nearest", intersect: false },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 45, minRotation: 0 },
      },
      y: { grid: { drawBorder: false } },
    },
  };

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Revenue",
        data: [0, 0, 0, 0, 0, 0, 0, totalRevenue],
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const productChartData = {
    labels: products.map((p) =>
      p.name.length > 15 ? `${p.name.substring(0, 15)}...` : p.name
    ),
    datasets: [
      {
        label: "Units Sold",
        data: products.map((product) =>
          order.reduce((sum, o) => {
            const prod = o.products.find((p) => p.productId === product._id);
            return sum + (prod ? prod.quantity : 0);
          }, 0)
        ),
        backgroundColor: "#4f46e5",
        borderRadius: 4,
      },
      {
        label: "Revenue (৳)",
        data: products.map((product) =>
          order.reduce((sum, o) => {
            const prod = o.products.find((p) => p.productId === product._id);
            return sum + (prod ? prod.quantity * prod.price : 0);
          }, 0)
        ),
        backgroundColor: "#22c55e",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="px-2 lg:px-4 bg-gray-50 min-h-screen">
      <h2 className="text-center font-semibold text-md md:text-xl p-2 mb-4 border-b border-gray-300 select-none">
        Dashboard Overview
      </h2>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.url}
              className={`flex flex-col justify-between p-4 h-44 rounded-xl shadow hover:shadow-lg transition-all duration-300 ${item.bg}`}
            >
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
              <div className="pt-2">
                <p className="text-xs text-gray-500">{item.period}</p>
                <p className="text-sm text-gray-600 font-medium">{item.date}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border h-72 sm:h-80 md:h-96">
          <h3 className="font-semibold mb-3">Monthly Revenue</h3>
          <Line data={revenueData} options={chartOptions} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow border h-72 sm:h-80 md:h-96">
          <h3 className="font-semibold mb-3">Product Performance</h3>
          <Bar data={productChartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-4 rounded-lg shadow border mb-8 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            View all <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Order ID", "Customer", "Amount", "Status", "Date"].map(
                (h, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.slice(0, 5).map((o) => (
              <tr key={o._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                  <Link href={`/admin/orders/${o._id}`}>{o.orderId}</Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {o.user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ৳{o.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      o.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : o.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    } shadow-sm`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Products */}
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
              const prod = o.products.find((p) => p.productId === product._id);
              return sum + (prod ? prod.quantity : 0);
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
                    alt={product.name}
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
