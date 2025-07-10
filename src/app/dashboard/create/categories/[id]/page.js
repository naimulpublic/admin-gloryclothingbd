import CategoryForm from "@/components/createcategory/MainComponent";
import { GetSubCategoriesApi } from "@/next/api/NextjsApi";
import React from "react";

export default async function page({ params }) {
  const subcategori = await GetSubCategoriesApi();
  const id = await params.id;
  return (
    <div>
      <CategoryForm id={id} subcategories={subcategori} />
    </div>
  );
}
