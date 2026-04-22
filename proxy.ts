import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  // Allow NextAuth routes, static assets, and public pages
  if (
    pathname.startsWith("/_next") || // Next.js internal assets
    pathname.startsWith("/api/auth") || // Auth APIs
    pathname.startsWith("/public") || // Public assets
    pathname === "/auth" // Login page
  ) {
    return NextResponse.next();
  }

  // If user is not logged in, redirect to /auth
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth";
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise, allow access
  return NextResponse.next();
}

// ✅ Apply protection only to these routes
export const config = {
  matcher: [
    "/dashboard/:path*", // protects /dashboard and all its subpaths
    "/account/:path*",   // protects any route starting with /account
  ],
};
