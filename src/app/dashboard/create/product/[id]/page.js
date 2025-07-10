import React from "react";
import ProductCreatePage from "@/components/createproduct/ProductCreatePage";
import {
  GetBrandsApi,
  GetCategoriesApi,
  GetSubCategoriesApi,
} from "@/next/api/NextjsApi";

export default async function page({ params }) {
  const { id } = await params;

  const brandData = await GetBrandsApi();
  const categoriesData = await GetCategoriesApi();
  const subcategori = await GetSubCategoriesApi();

  return (
    <>
      <ProductCreatePage
        id={id}
        brandData={brandData}
        categoriesData={categoriesData}
        subcategori={subcategori}
      />
    </>
  );
}
