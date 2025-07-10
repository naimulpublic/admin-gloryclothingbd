import CreateCoupon from "@/components/createcupon/CreateCupon";
import React from "react";

export default async function page({ params }) {
  const { id } = await params;
  return (
    <div>
      <CreateCoupon id={id} />
    </div>
  );
}
