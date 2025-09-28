import ProductCreatePage from "@/components/createproduct/ProductCreatePage";

export default async function ProductPage() {
   const reqbrand = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/brands`
  );
  const Brandresponse = await reqbrand.json();
  



   const reqcategory = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/categories?variant=regular`
  );


  const Categoryresponse = await reqcategory.json();


  const requestsubcategory = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/subcategorys`
  ); 
  const Subcategoyresponse = await requestsubcategory.json();


  
  const requestsubchild = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/subcategorychild`
  );
  const Subchildresponse = await requestsubchild.json();



  return (
    <div className="">
      <ProductCreatePage
        brandData={Brandresponse}
        categoriesData={Categoryresponse}
        subcategori={Subcategoyresponse}
        subChild={Subchildresponse} />
    </div>
  );
}
