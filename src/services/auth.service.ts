"use server";

import { nextServerFetch } from "@/lib/nextServerFetch";
import { cookies } from "next/headers";
import type {
  ApiResponse,
  IdentifierPayload,
  LoginPayload,
  PasswordChangePayload,
  ResetPasswordPayload,
} from "@/lib/types/api.type";
import type {
  EmployeeIdLoginPayload,
  GuestLoginPayload,
  LoginData,
  QrLoginPayload,
  RefreshTokenPayload,
  RegisterPayload,
  VerifyRegistrationOtpPayload,
} from "@/lib/types/auth.type";

const tokenCookies = [
  { responsePath: "data.accessToken", cookieName: "accessToken" },
  { responsePath: "data.refreshToken", cookieName: "refreshToken" },
];

const postPublic = <T>(endpoint: string, body: unknown) =>
  nextServerFetch<ApiResponse<T>>(endpoint, {
    method: "POST",
    body,
    isPublic: true,
  });

const postPublicWithSession = <T>(endpoint: string, body: unknown) =>
  nextServerFetch<ApiResponse<T>>(endpoint, {
    method: "POST",
    body,
    isPublic: true,
    setCookies: tokenCookies,
  });

export const login = async (payload: LoginPayload) =>
  postPublicWithSession<LoginData>("/auth/login", payload);

export const employeeIdLogin = async <T = unknown>(payload: EmployeeIdLoginPayload) =>
  postPublicWithSession<T>("/auth/employee-id-login", payload);

export const guestLogin = async <T = unknown>(payload: GuestLoginPayload) =>
  postPublicWithSession<T>("/auth/guest-login", payload);

export const qrLogin = async <T = unknown>(payload: QrLoginPayload) =>
  postPublicWithSession<T>("/auth/qr-login", payload);

export const register = async <T = unknown>(payload: RegisterPayload) =>
  postPublic<T>("/auth/register", payload);

export const verifyRegistrationOtp = async <T = unknown>(
  payload: VerifyRegistrationOtpPayload
) => postPublicWithSession<T>("/auth/regOtpVerify", payload);

export const resendOtp = async <T = unknown>(payload: IdentifierPayload) =>
  postPublic<T>("/auth/resendOtp", payload);

export const changePassword = async <T = unknown>(payload: PasswordChangePayload) =>
  nextServerFetch<ApiResponse<T>>("/auth/changePassword", {
    method: "POST",
    body: payload,
  });

export const forgotPassword = async <T = unknown>(payload: IdentifierPayload) =>
  postPublic<T>("/auth/forgotPass", payload);

export const resetPassword = async <T = unknown>(payload: ResetPasswordPayload) =>
  postPublic<T>("/auth/resetPass", payload);

export const refreshToken = async <T = unknown>(payload: RefreshTokenPayload) =>
  postPublicWithSession<T>("/auth/refresh-token", payload);

export const logout = async <T = unknown>() => {
  try {
    return await nextServerFetch<ApiResponse<T>>("/auth/logout", {
      method: "POST",
    });
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("rememberMe");
  }
};
