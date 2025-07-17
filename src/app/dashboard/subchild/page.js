import SubChildView from "@/components/subchildview/SubChildView";
import { GetSubChildApi } from "@/next/api/NextjsApi";
import React from "react";

export default async function page() {
    const subchild = await GetSubChildApi();
  return (
    <div>
      <SubChildView subchild={subchild} />
    </div>
  );
}
