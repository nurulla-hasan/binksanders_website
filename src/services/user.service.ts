import { buildQueryString } from "@/lib/buildQueryString";
import { createMultipartBody } from "@/lib/createMultipartBody";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type { TQuery } from "@/lib/types/global.type";
import type { UpdateUserProfilePayload } from "@/lib/types/user.type";

export const getUsers = <T = unknown>(params: TQuery = {}) =>
  nextServerFetch<ApiResponse<T>>(`/user${buildQueryString(params)}`, {
    tags: ["users"],
  });

export const getMyProfile = <T = unknown>() =>
  nextServerFetch<ApiResponse<T>>("/user/me", { revalidate: 0 });

export const updateProfile = <T = unknown>({
  data,
  image,
}: UpdateUserProfilePayload) =>
  nextServerFetch<ApiResponse<T>>("/user/update-me", {
    method: "PATCH",
    body: createMultipartBody(data, { image }),
    updateTag: "users",
  });

export const setupProfile = <T = unknown>({
  data,
  image,
}: UpdateUserProfilePayload) =>
  nextServerFetch<ApiResponse<T>>("/user/setup-profile", {
    method: "PATCH",
    body: createMultipartBody(data, { image }),
    updateTag: "users",
  });
