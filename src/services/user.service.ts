"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { createMultipartBody } from "@/lib/createMultipartBody";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type { TQuery } from "@/lib/types/global.type";
import type {
  CurrentUser,
  CompanyUserListData,
  UserListData,
  UpdateUserProfilePayload,
} from "@/lib/types/user.type";

export const getUsers = async (params: TQuery = {}) =>
  nextServerFetch<ApiResponse<UserListData>>(`/user${buildQueryString(params)}`, {
    tags: ["users"],
  });

export const getCompanyUsers = async (params: TQuery = {}) =>
  nextServerFetch<ApiResponse<CompanyUserListData>>(
    `/user/company-users${buildQueryString(params)}`,
    { tags: ["company-users"] },
  );

export const getMyProfile = async () =>
  nextServerFetch<ApiResponse<CurrentUser>>("/user/me", { revalidate: 0 });

export const updateProfile = async <T = unknown>({
  data,
  image,
}: UpdateUserProfilePayload) =>
  nextServerFetch<ApiResponse<T>>("/user/update-me", {
    method: "PATCH",
    body: createMultipartBody(data, { image }),
    updateTag: "users",
  });

export const setupProfile = async <T = unknown>({
  data,
  image,
}: UpdateUserProfilePayload) =>
  nextServerFetch<ApiResponse<T>>("/user/setup-profile", {
    method: "PATCH",
    body: createMultipartBody(data, { image }),
    updateTag: "users",
  });
