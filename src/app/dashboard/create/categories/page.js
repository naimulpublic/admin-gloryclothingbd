import CategoryForm from "@/components/createcategory/MainComponent";
import { GetSubCategoriesApi } from "@/next/api/NextjsApi";


export default async function page() {
  const subcategori = await GetSubCategoriesApi();
  return (
    <div className="bg-bgbody">
      <CategoryForm subcategories={subcategori} />
    </div>
  );
}
