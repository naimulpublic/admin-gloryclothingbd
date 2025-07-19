import React from "react";
import ProductCreatePage from "@/components/createproduct/ProductCreatePage";
import {
  GetBrandsApi,
  GetCategoriesApi,
  GetSubCategoriesApi,
  GetSubChildApi,
} from "@/next/api/NextjsApi";

export default async function page({ params }) {
  const { id } = await params;

  const brandData = await GetBrandsApi();
  const categoriesData = await GetCategoriesApi();
  const subcategori = await GetSubCategoriesApi();
  const subChild = await GetSubChildApi();

  return (
    <>
      <ProductCreatePage
        id={id}
        brandData={brandData}
        categoriesData={categoriesData}
        subcategori={subcategori}
        subChild={subChild}
      />
    </>
  );
}
