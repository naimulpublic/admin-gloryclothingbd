import RootAdmin from "@/components/rootadmin/RootAdmin";
import { GetRootAdminApi } from "@/next/api/NextjsApi";
import React from "react";

export default async function page() {
  const rootAdmin = await GetRootAdminApi();
  return (
    <div>
      <RootAdmin rootAdmin={rootAdmin} />
    </div>
  );
}
