"use server";

import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type { AdminDashboardData } from "@/lib/types/dashboard.type";

export const getAdminDashboard = async () =>
  nextServerFetch<ApiResponse<AdminDashboardData>>("/dashboard", {
    cache:"no-store",
  });
