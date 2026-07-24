"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { createMultipartBody } from "@/lib/createMultipartBody";
import { nextServerFetch } from "@/lib/nextServerFetch";
import { updateTag } from "next/cache";
import type {
  AdminLoginData,
  AdminLoginResult,
  AdminListData,
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
  payload: LoginPayload,
): Promise<AdminLoginResult> => {
  try {
    const response = await nextServerFetch<ApiResponse<AdminLoginData>>(
      "/admin/login",
      {
        method: "POST",
        body: payload,
        auth: "none",
      },
    );

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Unable to log in",
      };
    }

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    if (response.data.accessToken) {
      cookieStore.set("accessToken", response.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return {
      success: true,
      message: response.message || "Logged in successfully",
      role: response.data.admin.role,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to log in. Please try again.",
    };
  }
};

export const adminForgotPassword = async <T = unknown>(
  payload: IdentifierPayload,
) =>
  nextServerFetch<ApiResponse<T>>("/admin/forgot-password", {
    method: "POST",
    body: payload,
    auth: "none",
  });

export const adminResetPassword = async <T = unknown>(
  payload: ResetPasswordPayload,
) =>
  nextServerFetch<ApiResponse<T>>("/admin/reset-password", {
    method: "POST",
    body: payload,
    auth: "none",
  });

export const updateAdminProfile = async <T = unknown>({
  data,
  image,
}: UpdateAdminProfilePayload) => {
  const response = await nextServerFetch<ApiResponse<T>>(
    "/admin/update-profile",
    {
      method: "PATCH",
      body: createMultipartBody(data, { image }),
    },
  );
  if (response && response.success) {
    updateTag("admins");
  }
  return response;
};

export const changeAdminPassword = async <T = unknown>(
  payload: PasswordChangePayload,
) =>
  nextServerFetch<ApiResponse<T>>("/admin/change-password", {
    method: "POST",
    body: payload,
  });

export const createAdmin = async <T = unknown>(payload: CreateAdminPayload) => {
  const response = await nextServerFetch<ApiResponse<T>>(
    "/admin/create-admin",
    {
      method: "POST",
      body: payload,
    },
  );
  if (response && response.success) {
    updateTag("admins");
  }
  return response;
};

export const resendAdminOtp = async <T = unknown>(payload: IdentifierPayload) =>
  nextServerFetch<ApiResponse<T>>("/admin/resendOtp", {
    method: "POST",
    body: payload,
    auth: "none",
  });

export const toggleEmployeeBlock = async <T = unknown>(userId: string) => {
  const response = await nextServerFetch<ApiResponse<T>>(
    `/admin/block-unblock/${userId}`,
    {
      method: "PATCH",
    },
  );
  if (response && response.success) {
    updateTag("users");
  }
  return response;
};

export const deleteAdmin = async <T = unknown>(adminId: string) => {
  const response = await nextServerFetch<ApiResponse<T>>(`/admin/${adminId}`, {
    method: "DELETE",
  });
  if (response && response.success) {
    updateTag("admins");
  }
  return response;
};

export const toggleAdminBlock = async <T = unknown>(adminId: string) => {
  const response = await nextServerFetch<ApiResponse<T>>(
    `/admin/block-unblock-admin/${adminId}`,
    {
      method: "PATCH",
    },
  );
  if (response && response.success) {
    updateTag("admins");
  }
  return response;
};

export const getAdmins = async (params: TQuery = { role: "admin" }) =>
  nextServerFetch<ApiResponse<AdminListData>>(
    `/admin${buildQueryString(params)}`,
    {
      next: { tags: ["admins"] },
    },
  );
