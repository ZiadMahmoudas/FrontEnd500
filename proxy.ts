import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Backward compatibility for links created by the old /en route strategy.
 * New language switching is state-based and never navigates away from the page.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(/^\/(en|ar)(?=\/|$)/);
  if (!match) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
  const response = NextResponse.redirect(url);
  response.cookies.set("NEXT_LOCALE", match[1], {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = { matcher: ["/en/:path*", "/ar/:path*"] };
