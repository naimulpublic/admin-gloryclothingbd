import Subcategory from "@/components/createsubcategories/Subcategori";
import React from "react";

export default function page({ params }) {
  return (
    <div>
      <Subcategory id={params.id} />
    </div>
  );
}
