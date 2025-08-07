import Order from "@/components/order/Order";
import { GetOrders } from "@/next/api/NextjsApi";
import React from "react";

export default async function page() {
  const orders = await GetOrders();
  return (
    <div>
      <Order orderData={orders} />
    </div>
  );
}
