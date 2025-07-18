import Subcategori from "@/components/createsubcategories/Subcategori";
import { GetSubChildApi } from "@/next/api/NextjsApi";
import React from "react";

export default async function page() {
  const subChild = await GetSubChildApi();
  return (
    <div>
      <Subcategori subChild={subChild} />
    </div>
  );
}
