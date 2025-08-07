import DashboardHome from "@/components/dashboardhome/main/DashboardHome";
import { GetOrders, GetProductsApi } from "@/next/api/NextjsApi";

export default async function page() {
  const products = await GetProductsApi();
  const orders = await GetOrders();
  return (
    <>
      <div className=" p-1 lg:p-4">
        <DashboardHome order={orders} products={products} />
      </div>
    </>
  );
}
