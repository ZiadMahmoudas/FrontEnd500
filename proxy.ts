import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.[^/]+$/;
function excluded(pathname: string) {
  return PUBLIC_FILE.test(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/api") || ["/robots.txt", "/sitemap.xml", "/manifest.webmanifest"].includes(pathname) || pathname.startsWith("/google");
}
function strip(pathname: string) {
  if (pathname === "/en" || pathname === "/ar") return "/";
  return pathname.replace(/^\/(en|ar)(?=\/)/, "") || "/";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (excluded(pathname)) return NextResponse.next();
  const forced = request.headers.get("x-elmohager-locale");
  if (forced === "en" || forced === "ar") return NextResponse.next({ request: { headers: request.headers } });

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = strip(pathname);
    const headers = new Headers(request.headers);
    headers.set("x-elmohager-locale", "en");
    const response = NextResponse.rewrite(url, { request: { headers } });
    response.cookies.set("NEXT_LOCALE", "en", { path: "/", maxAge: 31536000, sameSite: "lax" });
    return response;
  }
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    const url = request.nextUrl.clone();
    url.pathname = strip(pathname);
    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", "ar", { path: "/", maxAge: 31536000, sameSite: "lax" });
    return response;
  }
  const headers = new Headers(request.headers);
  headers.set("x-elmohager-locale", "ar");
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
