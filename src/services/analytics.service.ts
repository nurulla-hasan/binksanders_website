"use server";

import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ModuleQuestionAnalyticsData } from "@/lib/types/analytics.type";
import type { ApiResponse } from "@/lib/types/api.type";

export const getModuleQuestionAnalytics = async (moduleId: string) =>
  nextServerFetch<ApiResponse<ModuleQuestionAnalyticsData>>(
    `/analytics/module/${moduleId}/question-stats`,
    { cache: "no-store" },
  );
