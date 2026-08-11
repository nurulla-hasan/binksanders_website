import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIES = [
  "accessToken",
  "refreshToken",
  "rememberMe",
  "guestId",
];

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/auth/login", request.url));

  SESSION_COOKIES.forEach((cookieName) => response.cookies.delete(cookieName));

  return response;
}
