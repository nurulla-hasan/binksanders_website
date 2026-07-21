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
  "/auth/register",
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

const isRoute = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const payload = decodeValidToken(accessToken);
  const isAdmin = Boolean(payload?.role && ADMIN_ROLES.has(payload.role));
  const isCompany = payload?.role === "company";
  const homePath = isAdmin ? "/super-admin" : isCompany ? "/company" : "/";
  const isPublicAuthRoute =
    ADMIN_PUBLIC_ROUTES.has(pathname) || USER_PUBLIC_ROUTES.has(pathname);

  if (isPublicAuthRoute) {
    return payload ? redirectTo(request, homePath) : NextResponse.next();
  }

  if (!payload) {
    return redirectTo(
      request,
      isRoute(pathname, "/super-admin")
        ? "/auth/admin-login"
        : "/auth/login",
    );
  }

  if (isAdmin) {
    return isRoute(pathname, "/super-admin")
      ? NextResponse.next()
      : redirectTo(request, "/super-admin");
  }

  if (isCompany) {
    return isRoute(pathname, "/company")
      ? NextResponse.next()
      : redirectTo(request, "/company");
  }

  if (
    isRoute(pathname, "/super-admin") ||
    isRoute(pathname, "/company") ||
    isRoute(pathname, "/auth")
  ) {
    return redirectTo(request, "/");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
