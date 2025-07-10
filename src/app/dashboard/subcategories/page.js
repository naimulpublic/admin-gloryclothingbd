import SubCategories from "@/components/subcategori/SubCategories";
import { GetSubCategoriesApi } from "@/next/api/NextjsApi";
import React from "react";

export default async function page() {
  const subcategori = await GetSubCategoriesApi();
  return (
    <div>
      <SubCategories  subcategori={subcategori}/>
    </div>
  );
}
