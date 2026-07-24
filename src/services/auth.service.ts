"use server";

import { nextServerFetch } from "@/lib/nextServerFetch";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type {
  ApiResponse,
  IdentifierPayload,
  LoginPayload,
  PasswordChangePayload,
  ResetPasswordPayload,
} from "@/lib/types/api.type";
import type {
  EmployeeIdLoginPayload,
  GenerateQrData,
  GenerateQrPayload,
  GuestLoginPayload,
  LoginData,
  QrLoginData,
  QrLoginPayload,
  QrLoginResult,
  RefreshTokenPayload,
  RegisterPayload,
  VerifyRegistrationOtpPayload,
} from "@/lib/types/auth.type";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setSessionCookies = async (data: any) => {
  if (!data) return;
  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  if (data.accessToken) cookieStore.set("accessToken", data.accessToken, options);
  if (data.refreshToken) cookieStore.set("refreshToken", data.refreshToken, options);
  if (data.user?.guestId) cookieStore.set("guestId", data.user.guestId, options);
};

export const login = async (payload: LoginPayload) => {
  const response = await nextServerFetch<ApiResponse<LoginData>>("/auth/login", {
    method: "POST",
    body: payload,
    auth: "none",
  });
  if (response.success) await setSessionCookies(response.data);
  return response;
};

export const employeeIdLogin = async <T = unknown>(payload: EmployeeIdLoginPayload) => {
  const response = await nextServerFetch<ApiResponse<T>>("/auth/employee-id-login", {
    method: "POST",
    body: payload,
    auth: "none",
  });
  if (response.success) await setSessionCookies(response.data);
  return response;
};

export const guestLogin = async <T = unknown>(payload: GuestLoginPayload) => {
  const response = await nextServerFetch<ApiResponse<T>>("/auth/guest-login", {
    method: "POST",
    body: payload,
    auth: "none",
  });
  if (response.success) await setSessionCookies(response.data);
  return response;
};

export const qrLogin = async (
  payload: QrLoginPayload
): Promise<QrLoginResult> => {
  try {
    const response = await nextServerFetch<ApiResponse<QrLoginData>>("/auth/qr-login", {
      method: "POST",
      body: payload,
      auth: "none",
    });

    if (!response.success) {
      return { success: false, message: response.message || "QR login failed" };
    }

    await setSessionCookies(response.data);

    return {
      success: true,
      message: response.message || "QR login successful",
      data: response.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to log in with this QR code",
    };
  }
};

export const generateQrCode = async (payload: GenerateQrPayload) =>
  nextServerFetch<ApiResponse<GenerateQrData>>("/auth/generate-qr", {
    method: "POST",
    body: payload,
    auth: "required",
  });

export const register = async <T = unknown>(payload: RegisterPayload) =>
  nextServerFetch<ApiResponse<T>>("/auth/register", {
    method: "POST",
    body: payload,
    auth: "none",
  });

export const verifyRegistrationOtp = async <T = unknown>(
  payload: VerifyRegistrationOtpPayload
) => {
  const response = await nextServerFetch<ApiResponse<T>>("/auth/regOtpVerify", {
    method: "POST",
    body: payload,
    auth: "none",
  });
  if (response.success) await setSessionCookies(response.data);
  return response;
};

export const resendOtp = async <T = unknown>(payload: IdentifierPayload) =>
  nextServerFetch<ApiResponse<T>>("/auth/resendOtp", {
    method: "POST",
    body: payload,
    auth: "none",
  });

export const changePassword = async <T = unknown>(payload: PasswordChangePayload) =>
  nextServerFetch<ApiResponse<T>>("/auth/changePassword", {
    method: "POST",
    body: payload,
    auth: "required",
  });

export const forgotPassword = async <T = unknown>(payload: IdentifierPayload) =>
  nextServerFetch<ApiResponse<T>>("/auth/forgotPass", {
    method: "POST",
    body: payload,
    auth: "none",
  });

export const resetPassword = async <T = unknown>(payload: ResetPasswordPayload) =>
  nextServerFetch<ApiResponse<T>>("/auth/resetPass", {
    method: "POST",
    body: payload,
    auth: "none",
  });

export const refreshToken = async <T = unknown>(payload: RefreshTokenPayload) => {
  const response = await nextServerFetch<ApiResponse<T>>("/auth/refresh-token", {
    method: "POST",
    body: payload,
    auth: "none",
  });
  if (response.success) await setSessionCookies(response.data);
  return response;
};

export const logout = async (
  redirectPath: "/auth/login" | "/auth/admin-login"
) => {
  try {
    await nextServerFetch<ApiResponse<unknown>>("/auth/logout", {
      method: "POST",
      auth: "required",
    });
  } catch {
    // Local session must still be cleared if the API session is already invalid.
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("rememberMe");
  }

  redirect(redirectPath);
};
