import ViewShopNowImage from "@/components/view/shopnowimage/ShopNow";


export default async function page() {
    const request = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/shopnowimage`
  );
  const response = await request.json();
  return (
    <div>
      <ViewShopNowImage Slider={response}/>
    </div>
  )
}
