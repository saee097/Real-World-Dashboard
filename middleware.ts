import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/login", "/register", "/products", "/categories", "/orders", "/suppliers", "/warehouses"];
const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "stockpilot-secret-key-2026");

interface JwtPayload {
  userId: number;
  email: string;
  name: string;
  role: "admin" | "manager" | "viewer" | "user";
  exp: number;
}

function getRedirectPath(role: string) {
  return role === "admin" ? "/Admin/dashboard" : "/";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  let user: JwtPayload | null = null;

  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify<JwtPayload>(sessionCookie, SECRET);
      user = payload;
    } catch {
      user = null;
    }
  }

  const isPublicPage = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isPublicPage && user) {
    return NextResponse.redirect(new URL(getRedirectPath(user.role), request.url));
  }

  if (!isPublicPage && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/Admin/") && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth/register|api/auth/login|api/auth/logout|api/auth/me).*)"],
};
