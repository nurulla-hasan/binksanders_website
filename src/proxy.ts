import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type TokenPayload = {
  exp?: number;
  role?: string;
  userId?: string;
};

const ADMIN_ROLES = new Set(["superAdmin", "admin"]);

const ADMIN_PUBLIC_ROUTES = new Set([
  "/auth/admin-login",
  "/auth/admin-forgot-password",
  "/auth/admin-reset-password",
]);

const USER_PUBLIC_ROUTES = new Set([
  "/auth/login",
  "/auth/forgot-password",
  "/auth/verify-otp",
  "/auth/reset-password",
]);

const decodeValidToken = (token?: string): TokenPayload | null => {
  if (!token) return null;

  try {
    const payload = jwtDecode<TokenPayload>(token);
    if (!payload.exp || payload.exp * 1000 <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

const redirectTo = (request: NextRequest, pathname: string) => {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const payload = decodeValidToken(accessToken);
  const isAdmin = Boolean(payload?.role && ADMIN_ROLES.has(payload.role));
  const isCompany = payload?.role === "company";

  if (payload && isAdmin && !pathname.startsWith("/super-admin")) {
    return redirectTo(request, "/super-admin");
  }

  if (payload && isCompany && !pathname.startsWith("/company")) {
    return redirectTo(request, "/company");
  }

  if (ADMIN_PUBLIC_ROUTES.has(pathname)) {
    return payload && isAdmin
      ? redirectTo(request, "/super-admin")
      : NextResponse.next();
  }

  if (USER_PUBLIC_ROUTES.has(pathname)) {
    if (!payload) return NextResponse.next();
    return redirectTo(
      request,
      isAdmin ? "/super-admin" : isCompany ? "/company" : "/",
    );
  }

  if (pathname.startsWith("/super-admin")) {
    if (!payload) return redirectTo(request, "/auth/admin-login");
    if (!isAdmin) return redirectTo(request, "/");
    return NextResponse.next();
  }

  if (pathname.startsWith("/company")) {
    if (!payload) return redirectTo(request, "/auth/login");
    if (isAdmin) return redirectTo(request, "/super-admin");
    if (!isCompany) return redirectTo(request, "/");
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
