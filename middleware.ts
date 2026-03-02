import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const hasToken = Boolean(accessToken || refreshToken);

  const publicRoutes = [
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ];

  const isPublicRoute = publicRoutes.includes(pathname);

  if (hasToken && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!hasToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
