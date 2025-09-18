import CategoriesPage from "@/components/categori/Categories";

export default async function page() {
  const req = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/categories`)
  const res = await req.json()
  return (
    <div>
      <CategoriesPage categories={res} />
    </div>
  );
}
