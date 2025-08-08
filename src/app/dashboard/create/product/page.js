import ProductCreatePage from "@/components/createproduct/ProductCreatePage";
import { GetBrandsApi, GetCategoriesApi, GetSubCategoriesApi, GetSubChildApi } from "@/next/api/NextjsApi";
import React from "react";

export default async function page() {
  const brandData = await GetBrandsApi();
  const categoriesData = await GetCategoriesApi();
  const subcategori = await GetSubCategoriesApi();
  const subChild = await GetSubChildApi();
  return (
    <div className="mb-20">
      <ProductCreatePage brandData={brandData} categoriesData={categoriesData} subcategori={subcategori} subChild={subChild}/>
    </div>
  );
}
