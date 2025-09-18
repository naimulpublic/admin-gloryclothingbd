import SubcategoryChild from "@/components/createsubcategorychild/CreateSubcategoryChild";

export default async function page({ params }) {
  const { id } = await params;
 
  return (
    <div>
      <SubcategoryChild id={id} />
    </div>
  );
}
