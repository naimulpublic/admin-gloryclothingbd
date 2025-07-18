import Subcategory from "@/components/createsubcategories/Subcategori";
import { GetSubChildApi } from "@/next/api/NextjsApi";
import React from "react";

export default async function page({ params }) {
  const { id } = await params;
    const subChild = await GetSubChildApi();
  
  return (
    <div>
      <Subcategory id={id}subChild={subChild} />
    </div>
  );
}
