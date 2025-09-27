import ProductView from "@/components/liveproducts/LiveProducts";


 async function GetProducts() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/products?variant=regular`
    );
    const data = await res.json();

    return data
}
  
const response = await GetProducts();

export default async function LiveProductsPage() {


  return (
    <div>
      <ProductView data={response} />
    </div>
  );
}
