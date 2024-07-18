import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname, search, href, origin } = request.nextUrl;

  response.headers.set("x-pathname", pathname);
  response.headers.set("x-pathname-search", search);
  response.headers.set("x-origin", origin);
  response.headers.set("x-url", href);

  if (pathname === "/album") {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("token");

    if (!tokenCookie) {
      return NextResponse.rewrite(new URL("/login", request.url));
    }

    const user = cookieStore.get("user")?.value;

    if (!user) {
      return NextResponse.rewrite(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
