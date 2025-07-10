import SliderForm from "@/components/createslider/CreateSlider";
import React from "react";

export default async function page({ params }) {
  const { id } = await params;
  return (
    <div>
      <SliderForm id={id} />
    </div>
  );
}
