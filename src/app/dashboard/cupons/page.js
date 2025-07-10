import CuponView from "@/components/cupons/CuponView";
import { GetCuponsApi } from "@/next/api/NextjsApi";
import React from "react";

export default async function page() {
  const cupons =await GetCuponsApi();
  
  
  return (
    <div>
    <CuponView cupon={cupons} />
    </div>
  );
}
