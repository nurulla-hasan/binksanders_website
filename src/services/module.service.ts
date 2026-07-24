"use server";

import { updateTag } from "next/cache";
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
    next: { tags: ["modules"] },
  });

export const getModule = async (moduleId: string) =>
  nextServerFetch<ApiResponse<LearningModule>>(`/module/${moduleId}`, {
    next: { tags: ["modules", `module-${moduleId}`] },
  });

export const getCompanyModules = async (
  companyId: string,
  params: TQuery = {},
) =>
  nextServerFetch<ApiResponse<LearningModule[]>>(
    `/module/company/${companyId}${buildQueryString(params)}`,
    { next: { tags: ["modules", `company-${companyId}-modules`] } },
  );

export const createModule = async <T = unknown>({
  data,
  thumbnailImage,
}: CreateModulePayload) => {
  const response = await nextServerFetch<ApiResponse<T>>("/module", {
    method: "POST",
    body: createMultipartBody(data, { thumbnailImage }),
  });
  if (response && response.success) {
    updateTag("modules");
  }
  return response;
};

export const updateModule = async <T = unknown>(
  moduleId: string,
  payload: UpdateModulePayload,
) => {
  const response = await nextServerFetch<ApiResponse<T>>(
    `/module/${moduleId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
  if (response && response.success) {
    updateTag("modules");
    updateTag(`module-${moduleId}`);
  }
  return response;
};

export const duplicateModule = async <T = unknown>(
  moduleId: string,
  payload: DuplicateModulePayload,
) => {
  const response = await nextServerFetch<ApiResponse<T>>(
    `/module/duplicate/${moduleId}`,
    {
      method: "POST",
      body: payload,
    },
  );
  if (response && response.success) {
    updateTag("modules");
  }
  return response;
};

export const deleteModule = async <T = unknown>(moduleId: string) => {
  const response = await nextServerFetch<ApiResponse<T>>(
    `/module/${moduleId}`,
    {
      method: "DELETE",
    },
  );
  if (response && response.success) {
    updateTag("modules");
    updateTag(`module-${moduleId}`);
  }
  return response;
};

export const assignModulesToCompany = async <T = unknown>(
  payload: AssignModulesPayload,
) => {
  const response = await nextServerFetch<ApiResponse<T>>("/module/assign", {
    method: "POST",
    body: payload,
  });
  if (response && response.success) {
    updateTag("modules");
    updateTag(`company-${payload.companyId}-modules`);
    updateTag(`company-${payload.companyId}-teams`);
  }
  return response;
};

export const unassignModule = async <T = unknown>(
  moduleId: string,
  companyId: string,
) => {
  const response = await nextServerFetch<ApiResponse<T>>(
    `/module/unassign/${moduleId}`,
    {
      method: "POST",
    },
  );
  if (response && response.success) {
    updateTag("modules");
    updateTag(`module-${moduleId}`);
    updateTag(`company-${companyId}-modules`);
  }
  return response;
};
