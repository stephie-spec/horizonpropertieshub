import { NextResponse } from "next/server"

export function middleware(request) {
  const user = request.cookies.get("user")?.value
  const pathname = request.nextUrl.pathname

  // Redirect authenticated users away from auth pages
  if (user && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  if (user && pathname.startsWith("/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/forgot-password",
    "/dashboard/:path*",
    "/properties/:path*",
    "/units/:path*",
    "/tenants/:path*",
    "/payments/:path*",
    "/statements/:path*",
    "/notifications/:path*",
  ],
}
