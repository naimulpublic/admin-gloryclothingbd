import DashboardHome from "@/components/dashboardhome/main/DashboardHome";
import { GetOrders } from "@/next/api/NextjsApi";


async function Getproducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/products?variant=regular`
  );
  const data = await res.json();
  return data;
}

export default async function page() {
  const products = await Getproducts();
  const orders = await GetOrders();
  return (
    <>
      <div className=" p-1 lg:p-4">
        <DashboardHome order={orders} products={products} />
      </div>
    </>
  );
}
