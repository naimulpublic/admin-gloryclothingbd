"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Toaster, toast } from "sonner";

export default function Page() {
  return (
    <div className="p-10">
      <div>
        <Toaster position="top-right" theme="dark" richColors expand />

        <Button onClick={() => toast("Admin login successfull")}>
          test toast
        </Button>
      </div>
    </div>
  );
}
