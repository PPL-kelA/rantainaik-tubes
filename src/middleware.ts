import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/reset-password");

  const isAdminRoute = pathname.startsWith("/admin");
  const isUmkmRoute = pathname.startsWith("/umkm");
  const isIndustriRoute = pathname.startsWith("/industri");

  // 1. Logged in users visiting auth pages (login/register) redirect to respective dashboard
  if (user && isAuthRoute) {
    const role = user.role;
    if (role === "ADMIN")
      return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "UMKM")
      return NextResponse.redirect(new URL("/umkm", req.url));
    if (role === "INDUSTRY")
      return NextResponse.redirect(new URL("/industri", req.url));
  }

  // 2. Protected routes: check authentication & role
  if (isAdminRoute || isUmkmRoute || isIndustriRoute) {
    if (!user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = user.role;

    // RBAC: Check route access against user role
    if (isAdminRoute && role !== "ADMIN") {
      const redirectUrl = role === "UMKM" ? "/umkm" : "/industri";
      return NextResponse.redirect(
        new URL(`${redirectUrl}?error=unauthorized`, req.url)
      );
    }

    if (isUmkmRoute && role !== "UMKM") {
      const redirectUrl = role === "ADMIN" ? "/admin" : "/industri";
      return NextResponse.redirect(
        new URL(`${redirectUrl}?error=unauthorized`, req.url)
      );
    }

    if (isIndustriRoute && role !== "INDUSTRY") {
      const redirectUrl = role === "ADMIN" ? "/admin" : "/umkm";
      return NextResponse.redirect(
        new URL(`${redirectUrl}?error=unauthorized`, req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/umkm/:path*",
    "/industri/:path*",
    "/login",
    "/register",
    "/reset-password",
  ],
};
