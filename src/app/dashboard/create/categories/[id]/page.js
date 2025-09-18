import CreateCategory from "@/components/createcategory/CreateCategory";


export default async function page({ params }) {
 const { id } = await params;
  
   const req = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/subcategorys`);
  const res = await req.json();
  return (
    <div>
      <CreateCategory id={id} subcategories={res} />
    </div>
  );
}
