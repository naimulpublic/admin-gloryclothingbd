import CategoriesPage from "@/components/categori/Categories";
import { GetCategoriesApi } from "@/next/api/NextjsApi";
import React from "react";

export default async function page() {
  const Category =await GetCategoriesApi();
  return (
    <div>
      <CategoriesPage categories={Category} />
    </div>
  );
}
