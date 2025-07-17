import React from "react";
import SubChild from "@/components/createsubchild/SubChild";

export default async function page({ params }) {
  const { id } = await params;
  return <div>
    <SubChild id={id} />
  </div>;
}
