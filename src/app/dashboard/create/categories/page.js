import CreateCategory from "@/components/createcategory/CreateCategory";
import RoutePath from "@/custom/routepath/RoutePath";

export default async function page() {
  const req = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/subcategorys`);
  const res = await req.json();
  return (
    <div className="">
      <RoutePath />
      <CreateCategory subcategories={res} /> 
    </div>
  );
}
