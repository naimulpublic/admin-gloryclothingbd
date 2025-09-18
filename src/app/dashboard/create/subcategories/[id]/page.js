import Subcategory from "@/components/createsubcategories/Subcategori";

export default async function page({ params }) {
  const { id } = await params;
  const req = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/subcategorychild`)
const res = await req.json()
  return (
    <div>
      <Subcategory  id={id} subcategorydata={res}/>
    </div>
  );
}
