import SliderView from "@/components/slider/SliderView";
import { GetSlidersApi } from "@/next/api/NextjsApi";
import React from "react";

export default async function page() {
  const Slider = await GetSlidersApi();
  return (
    <div>
      <SliderView Slider={Slider} />
    </div>
  );
}
