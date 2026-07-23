"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { createMultipartBody } from "@/lib/createMultipartBody";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type { TQuery } from "@/lib/types/global.type";
import type {
  AssignModulesPayload,
  CreateModulePayload,
  DuplicateModulePayload,
  LearningModule,
  ModuleListResponse,
  UpdateModulePayload,
} from "@/lib/types/module.type";

export const getModules = async (params: TQuery = {}) =>
  nextServerFetch<ModuleListResponse>(`/module${buildQueryString(params)}`, {
    tags: ["modules"],
  });

export const getModule = async (moduleId: string) =>
  nextServerFetch<ApiResponse<LearningModule>>(`/module/${moduleId}`, {
    tags: ["modules", `module-${moduleId}`],
  });

export const getCompanyModules = async (
  companyId: string,
  params: TQuery = {},
) =>
  nextServerFetch<ApiResponse<LearningModule[]>>(
    `/module/company/${companyId}${buildQueryString(params)}`,
    { tags: ["modules", `company-${companyId}-modules`] },
  );

export const createModule = async <T = unknown>({
  data,
  thumbnailImage,
}: CreateModulePayload) =>
  nextServerFetch<ApiResponse<T>>("/module", {
    method: "POST",
    body: createMultipartBody(data, { thumbnailImage }),
    updateTag: "modules",
  });

export const updateModule = async <T = unknown>(
  moduleId: string,
  payload: UpdateModulePayload,
) =>
  nextServerFetch<ApiResponse<T>>(`/module/${moduleId}`, {
    method: "PATCH",
    body: payload,
    updateTag: ["modules", `module-${moduleId}`],
  });

export const duplicateModule = async <T = unknown>(
  moduleId: string,
  payload: DuplicateModulePayload,
) =>
  nextServerFetch<ApiResponse<T>>(`/module/duplicate/${moduleId}`, {
    method: "POST",
    body: payload,
    updateTag: "modules",
  });

export const deleteModule = async <T = unknown>(moduleId: string) =>
  nextServerFetch<ApiResponse<T>>(`/module/${moduleId}`, {
    method: "DELETE",
    updateTag: ["modules", `module-${moduleId}`],
  });

export const assignModulesToCompany = async <T = unknown>(
  payload: AssignModulesPayload,
) =>
  nextServerFetch<ApiResponse<T>>("/module/assign", {
    method: "POST",
    body: payload,
    updateTag: [
      "modules",
      `company-${payload.companyId}-modules`,
      `company-${payload.companyId}-teams`,
    ],
  });

export const unassignModule = async <T = unknown>(
  moduleId: string,
  companyId: string,
) =>
  nextServerFetch<ApiResponse<T>>(`/module/unassign/${moduleId}`, {
    method: "POST",
    updateTag: [
      "modules",
      `module-${moduleId}`,
      `company-${companyId}-modules`,
    ],
  });
