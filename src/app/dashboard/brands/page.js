import BrandView from "@/components/brand/BrandView";
import { GetBrandsApi } from "@/next/api/NextjsApi";
import React from "react";

export default async function page() {
  const brand = await GetBrandsApi();
  return (
    <div>
      <BrandView brandData={brand} />
    </div>
  );
}
