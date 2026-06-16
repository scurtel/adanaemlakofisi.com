import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasCookie = Boolean(request.cookies.get(COOKIE_NAME)?.value);

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !hasCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/admin/login" && hasCookie) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
