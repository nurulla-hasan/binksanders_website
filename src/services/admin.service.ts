"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { createMultipartBody } from "@/lib/createMultipartBody";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type {
  AdminLoginData,
  AdminLoginResult,
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

export const adminLogin = async (
  payload: LoginPayload
): Promise<AdminLoginResult> => {
  const response = await nextServerFetch<ApiResponse<AdminLoginData>>("/admin/login", {
    method: "POST",
    body: payload,
    isPublic: true,
    setCookies: [
      { responsePath: "data.accessToken", cookieName: "accessToken" },
    ],
  });

  if (!response.success) {
    throw new Error(response.message || "Unable to log in");
  }

  return { role: response.data.admin.role };
};

export const adminForgotPassword = async <T = unknown>(payload: IdentifierPayload) =>
  nextServerFetch<ApiResponse<T>>("/admin/forgot-password", {
    method: "POST",
    body: payload,
    isPublic: true,
  });

export const adminResetPassword = async <T = unknown>(payload: ResetPasswordPayload) =>
  nextServerFetch<ApiResponse<T>>("/admin/reset-password", {
    method: "POST",
    body: payload,
    isPublic: true,
  });

export const updateAdminProfile = async <T = unknown>({
  data,
  image,
}: UpdateAdminProfilePayload) =>
  nextServerFetch<ApiResponse<T>>("/admin/update-profile", {
    method: "PATCH",
    body: createMultipartBody(data, { image }),
    updateTag: "admins",
  });

export const changeAdminPassword = async <T = unknown>(
  payload: PasswordChangePayload
) =>
  nextServerFetch<ApiResponse<T>>("/admin/change-password", {
    method: "POST",
    body: payload,
  });

export const createAdmin = async <T = unknown>(payload: CreateAdminPayload) =>
  nextServerFetch<ApiResponse<T>>("/admin/create-admin", {
    method: "POST",
    body: payload,
    updateTag: "admins",
  });

export const resendAdminOtp = async <T = unknown>(payload: IdentifierPayload) =>
  nextServerFetch<ApiResponse<T>>("/admin/resendOtp", {
    method: "POST",
    body: payload,
    isPublic: true,
  });

export const toggleEmployeeBlock = async <T = unknown>(userId: string) =>
  nextServerFetch<ApiResponse<T>>(`/admin/block-unblock/${userId}`, {
    method: "PATCH",
    updateTag: "users",
  });

export const deleteAdmin = async <T = unknown>(adminId: string) =>
  nextServerFetch<ApiResponse<T>>(`/admin/${adminId}`, {
    method: "DELETE",
    updateTag: "admins",
  });

export const toggleAdminBlock = async <T = unknown>(adminId: string) =>
  nextServerFetch<ApiResponse<T>>(`/admin/block-unblock-admin/${adminId}`, {
    method: "PATCH",
    updateTag: "admins",
  });

export const getAdmins = async <T = unknown>(params: TQuery = { role: "admin" }) =>
  nextServerFetch<ApiResponse<T>>(`/admin${buildQueryString(params)}`, {
    tags: ["admins"],
  });
