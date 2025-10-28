import CreateShpopImage from "@/components/createshopimage/ShopImage";


export default async function page({params}) {
    const { id } = await params;
  return (
    <div><CreateShpopImage id={id}/>
    
    </div>
  )
}
