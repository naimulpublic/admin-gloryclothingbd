import ProductView from "@/components/liveproducts/LiveProducts";

export default async function LiveProductsPage() {
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/products`
  );
  const response = await request.json();

  return (
    <div>
      <ProductView data={response} />
    </div>
  );
}
