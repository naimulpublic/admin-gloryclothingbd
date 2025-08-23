import CategorySelector from "@/components/test/Category";
import { GetCategoriesApi } from "@/next/api/NextjsApi";
import React from "react";

export default async function page() {
  const data = await GetCategoriesApi();
  return (
    <div>
      <CategorySelector categoriesData={data} />
    </div>
  );
}
