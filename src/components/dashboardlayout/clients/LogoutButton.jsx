"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/auth/admin/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <button onClick={handleLogout} className="w-full text-left text-red-500">
      Logout
    </button>
  );
}
