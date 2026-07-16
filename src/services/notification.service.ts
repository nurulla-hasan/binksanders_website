"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { createMultipartBody } from "@/lib/createMultipartBody";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type { TQuery } from "@/lib/types/global.type";
import type {
  AdminBroadcastPayload,
  CompanyBroadcastPayload,
} from "@/lib/types/notification.type";

export const getNotifications = async <T = unknown>(params: TQuery = {}) =>
  nextServerFetch<ApiResponse<T>>(
    `/notification${buildQueryString(params)}`,
    { revalidate: 0 }
  );

export const markAllNotificationsRead = async <T = unknown>() =>
  nextServerFetch<ApiResponse<T>>("/notification/mark-all-read", {
    method: "PATCH",
  });

export const markNotificationRead = async <T = unknown>(notificationId: string) =>
  nextServerFetch<ApiResponse<T>>(
    `/notification/mark-read/${notificationId}`,
    { method: "PATCH" }
  );

export const broadcastNotification = async <T = unknown>({
  data,
  image,
}: AdminBroadcastPayload) =>
  nextServerFetch<ApiResponse<T>>("/notification/admin/broadcast", {
    method: "POST",
    body: createMultipartBody(data, { image }),
  });

export const broadcastToCompanies = async <T = unknown>(
  payload: CompanyBroadcastPayload
) =>
  nextServerFetch<ApiResponse<T>>(
    "/notification/broadcast-to-companies",
    { method: "POST", body: payload }
  );
