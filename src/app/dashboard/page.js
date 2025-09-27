import DashboardHome from "@/components/dashboardhome/main/DashboardHome";


async function Getproducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/products?variant=regular`
  );
  const data = await res.json();
  return data;
}

async function GetOrders() {
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/orders`
  );
  const response = await request.json();
  return response;
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
