import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type UserRole = "user" | "guest" | "company" | "superAdmin";

interface TokenPayload {
  exp?: number;
  role?: unknown;
}

const PUBLIC_ROUTES = [
  "/",
  "/qr-login",
];

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/admin-login",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-otp",
];

// Turn this on when the auth flow is ready to test
const IS_PROTECTION_ON = true;

const ROLE_HOME: Record<UserRole, string> = {
  user: "/modules",
  guest: "/modules",
  company: "/company/dashboard",
  superAdmin: "/super-admin",
};

const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
};

const isExpired = (token: string): boolean => {
  const payload = decodeToken(token);

  if (!payload?.exp) return true;

  return Date.now() / 1000 >= payload.exp;
};

const getRole = (token: string): UserRole | null => {
  const payload = decodeToken(token);
  const role = payload?.role;

  return role === "user" || role === "guest" || role === "company" || role === "superAdmin"
    ? role
    : null;
};

export async function proxy(request: NextRequest): Promise<NextResponse> {
  if (!IS_PROTECTION_ON) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const accessToken = request.cookies.get("accessToken")?.value;

  // Redirect authenticated users away from auth pages (login, register, etc.)
  if (isAuthRoute && accessToken && !isExpired(accessToken)) {
    const role = getRole(accessToken);

    if (role) {
      return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
    }
  }

  // Redirect unauthenticated users to login for protected pages
  if (!isPublic && !isAuthRoute) {
    if (!accessToken || isExpired(accessToken)) {
      const loginUrl = new URL(
        pathname.startsWith("/super-admin") ? "/auth/admin-login" : "/auth/login",
        request.url
      );

      loginUrl.searchParams.set("callbackUrl", pathname);

      return NextResponse.redirect(loginUrl);
    }

    const role = getRole(accessToken);

    if (!role) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Role-based access control
    if (pathname.startsWith("/modules") && role !== "user" && role !== "guest") {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    if (pathname.startsWith("/company") && role !== "company") {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    if (pathname.startsWith("/super-admin") && role !== "superAdmin") {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)",
  ],
};
