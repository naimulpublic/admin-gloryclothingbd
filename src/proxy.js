import { NextResponse } from "next/server";

export function proxy(req) {
  const token = req.cookies.get("loginAuth");

  if (!token) {
    return NextResponse.redirect(new URL("/auth/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};