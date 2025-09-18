import SubCategoriChild from "@/components/subchildview/SubChildView";

export default async function page() {
  const req = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/subcategorychild`);
  const res = await req.json();
  return (
    <div>
      <SubCategoriChild subcategorychild={res} />
    </div>
  );
}