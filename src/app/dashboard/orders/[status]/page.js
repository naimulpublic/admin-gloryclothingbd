import React from "react";
import Order from "@/components/order/Order";

export default async function page({ params }) {
  const { status } = await params;
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/orders/admin?status=${status}`
  );
  const orders = await req.json();
  return (
    <div>
      <Order orderData={orders} />
    </div>
  );
}
