import { nextServerFetch } from "@/lib/nextServerFetch";
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

export const login = <T = unknown>(payload: LoginPayload) =>
  postPublicWithSession<T>("/auth/login", payload);

export const employeeIdLogin = <T = unknown>(payload: EmployeeIdLoginPayload) =>
  postPublicWithSession<T>("/auth/employee-id-login", payload);

export const guestLogin = <T = unknown>(payload: GuestLoginPayload) =>
  postPublicWithSession<T>("/auth/guest-login", payload);

export const qrLogin = <T = unknown>(payload: QrLoginPayload) =>
  postPublicWithSession<T>("/auth/qr-login", payload);

export const register = <T = unknown>(payload: RegisterPayload) =>
  postPublic<T>("/auth/register", payload);

export const verifyRegistrationOtp = <T = unknown>(
  payload: VerifyRegistrationOtpPayload
) => postPublicWithSession<T>("/auth/regOtpVerify", payload);

export const resendOtp = <T = unknown>(payload: IdentifierPayload) =>
  postPublic<T>("/auth/resendOtp", payload);

export const changePassword = <T = unknown>(payload: PasswordChangePayload) =>
  nextServerFetch<ApiResponse<T>>("/auth/changePassword", {
    method: "POST",
    body: payload,
  });

export const forgotPassword = <T = unknown>(payload: IdentifierPayload) =>
  postPublic<T>("/auth/forgotPass", payload);

export const resetPassword = <T = unknown>(payload: ResetPasswordPayload) =>
  postPublic<T>("/auth/resetPass", payload);

export const refreshToken = <T = unknown>(payload: RefreshTokenPayload) =>
  postPublicWithSession<T>("/auth/refresh-token", payload);

export const logout = <T = unknown>() =>
  nextServerFetch<ApiResponse<T>>("/auth/logout", { method: "POST" });
