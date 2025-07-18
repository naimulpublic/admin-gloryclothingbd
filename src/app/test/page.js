"use client";
import { SubcategoryMultiSelect } from "@/components/custom/SubcategoryMultiselect";
import React, { useState } from "react";

export default function page() {
  const [selectsubchild, setSelectsubchild] = useState([]);

  const options = [
    {
      _id: "6879037e31df06423fe93a9b",
      name: "hello",
      slug: "sdfds",
    },
    {
      _id: "6879208d1894a4eea4e1c031",
      name: "test subcategory child",
      slug: "test-subcategory-child",
    },
    {
      _id: "687920a31894a4eea4e1c032",
      name: "test 1 ",
      slug: "test-1",
    },
  ];
  return (
    <>
      <div>
        <SubcategoryMultiSelect
          options={options}
          selected={selectsubchild}
          onChange={setSelectsubchild}
          placeholder="Select subcategories"
        />
      </div>
    </>
  );
}
