import { buildQueryString } from "@/lib/buildQueryString";
import { createMultipartBody } from "@/lib/createMultipartBody";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type {
  CreateAdminPayload,
  UpdateAdminProfilePayload,
} from "@/lib/types/admin.type";
import type {
  ApiResponse,
  IdentifierPayload,
  LoginPayload,
  PasswordChangePayload,
  ResetPasswordPayload,
} from "@/lib/types/api.type";
import type { TQuery } from "@/lib/types/global.type";

export const adminLogin = <T = unknown>(payload: LoginPayload) =>
  nextServerFetch<ApiResponse<T>>("/admin/login", {
    method: "POST",
    body: payload,
    isPublic: true,
    setCookies: [
      { responsePath: "data.accessToken", cookieName: "accessToken" },
      { responsePath: "data.refreshToken", cookieName: "refreshToken" },
    ],
  });

export const adminForgotPassword = <T = unknown>(payload: IdentifierPayload) =>
  nextServerFetch<ApiResponse<T>>("/admin/forgot-password", {
    method: "POST",
    body: payload,
    isPublic: true,
  });

export const adminResetPassword = <T = unknown>(payload: ResetPasswordPayload) =>
  nextServerFetch<ApiResponse<T>>("/admin/reset-password", {
    method: "POST",
    body: payload,
    isPublic: true,
  });

export const updateAdminProfile = <T = unknown>({
  data,
  image,
}: UpdateAdminProfilePayload) =>
  nextServerFetch<ApiResponse<T>>("/admin/update-profile", {
    method: "PATCH",
    body: createMultipartBody(data, { image }),
    updateTag: "admins",
  });

export const changeAdminPassword = <T = unknown>(
  payload: PasswordChangePayload
) =>
  nextServerFetch<ApiResponse<T>>("/admin/change-password", {
    method: "POST",
    body: payload,
  });

export const createAdmin = <T = unknown>(payload: CreateAdminPayload) =>
  nextServerFetch<ApiResponse<T>>("/admin/create-admin", {
    method: "POST",
    body: payload,
    updateTag: "admins",
  });

export const resendAdminOtp = <T = unknown>(payload?: IdentifierPayload) =>
  nextServerFetch<ApiResponse<T>>("/admin/resendOtp", {
    method: "POST",
    body: payload,
    isPublic: true,
  });

export const toggleEmployeeBlock = <T = unknown>(userId: string) =>
  nextServerFetch<ApiResponse<T>>(`/admin/block-unblock/${userId}`, {
    method: "PATCH",
    updateTag: "users",
  });

export const deleteAdmin = <T = unknown>(adminId: string) =>
  nextServerFetch<ApiResponse<T>>(`/admin/${adminId}`, {
    method: "DELETE",
    updateTag: "admins",
  });

export const toggleAdminBlock = <T = unknown>(adminId: string) =>
  nextServerFetch<ApiResponse<T>>(`/admin/block-unblock-admin/${adminId}`, {
    method: "PATCH",
    updateTag: "admins",
  });

export const getAdmins = <T = unknown>(params: TQuery = { role: "admin" }) =>
  nextServerFetch<ApiResponse<T>>(`/admin${buildQueryString(params)}`, {
    tags: ["admins"],
  });
