import Subcategory from "@/components/createsubcategories/Subcategori";
import React from "react";

export default async function page({ params }) {
  const { id } = await params;
  return (
    <div>
      <Subcategory id={id} />
    </div>
  );
}
