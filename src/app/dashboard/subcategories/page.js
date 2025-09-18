import SubCategoryView from "@/components/subcategori/SubCategories";


export default async function page() {
  const req = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/subcategorys`)
  const res = await req.json()
  
  
  return (
    <div>
      <SubCategoryView subcategorydata={res} />
    </div>
  );
}
