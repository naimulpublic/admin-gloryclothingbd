import AdminUserForm from "@/components/createadmin/CreateAdmin";
import React from "react";

export default async function page({ params }) {
  const { id } = await params;
  return (
    <div>
      <AdminUserForm id={id} />
    </div>
  );
}
