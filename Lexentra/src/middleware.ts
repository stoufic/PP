import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = [
  "/dashboard",
  "/agreements",
  "/templates",
  "/playbooks",
  "/review-center",
  "/approval-queue",
  "/signature-queue",
  "/search",
  "/reports",
  "/admin"
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const needsAuth = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const token = request.cookies.get("lexentra_session")?.value;

  if (
    needsAuth &&
    !token &&
    process.env.ENABLE_DEMO_FALLBACK !== "true"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/agreements/:path*",
    "/templates/:path*",
    "/playbooks/:path*",
    "/review-center/:path*",
    "/approval-queue/:path*",
    "/signature-queue/:path*",
    "/search/:path*",
    "/reports/:path*",
    "/admin/:path*"
  ]
};
