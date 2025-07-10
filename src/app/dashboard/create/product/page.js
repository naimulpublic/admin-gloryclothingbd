import ProductCreatePage from "@/components/createproduct/ProductCreatePage";
import { GetBrandsApi, GetCategoriesApi, GetSubCategoriesApi } from "@/next/api/NextjsApi";
import React from "react";

export default async function page() {
  const brandData = await GetBrandsApi();
  const categoriesData = await GetCategoriesApi();
  const subcategori = await GetSubCategoriesApi();
  return (
    <div>
      <ProductCreatePage brandData={brandData} categoriesData={categoriesData} subcategori={subcategori}/>
    </div>
  );
}
