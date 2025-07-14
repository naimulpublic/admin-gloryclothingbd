import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("loginAuth");

  if (!token) {
    return NextResponse.redirect(new URL("/auth/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};