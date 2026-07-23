"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { createMultipartBody } from "@/lib/createMultipartBody";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type {
  CompanyPayload,
  Company,
  CompanyListData,
  CompanyDropdownItem,
  PublicCompanyDropdownItem,
  CompanyStatus,
  UpdateCompanyBrandingPayload,
} from "@/lib/types/company.type";
import type { TQuery } from "@/lib/types/global.type";

export const createCompany = async <T = unknown>(payload: CompanyPayload) =>
  nextServerFetch<ApiResponse<T>>("/company/create-company", {
    method: "POST",
    body: payload,
    updateTag: "companies",
  });

export const getCompanies = async (params: TQuery = {}) =>
  nextServerFetch<ApiResponse<CompanyListData>>(`/company${buildQueryString(params)}`, {
    tags: ["companies"],
  });

export const getCompanyDropdown = async (params: TQuery = {}) =>
  nextServerFetch<ApiResponse<CompanyDropdownItem[]>>(
    `/company/dropdown${buildQueryString(params)}`,
    { tags: ["companies"] }
  );

export const getPublicCompanyDropdown = async () =>
  nextServerFetch<ApiResponse<PublicCompanyDropdownItem[]>>("/company/dropdown", {
    isPublic: true,
    revalidate: 300,
  });

export const getCompany = async (companyId: string) =>
  nextServerFetch<ApiResponse<Company>>(`/company/${companyId}`, {
    tags: ["companies", `company-${companyId}`],
  });

export const updateCompany = async <T = unknown>(
  companyId: string,
  payload: Partial<CompanyPayload>
) =>
  nextServerFetch<ApiResponse<T>>(`/company/${companyId}`, {
    method: "PATCH",
    body: payload,
    updateTag: ["companies", `company-${companyId}`],
  });

export const updateCompanyStatus = async <T = unknown>(
  companyId: string,
  status: CompanyStatus
) =>
  nextServerFetch<ApiResponse<T>>(`/company/${companyId}/status`, {
    method: "PATCH",
    body: { status },
    updateTag: ["companies", `company-${companyId}`],
  });

export const updateCompanyBranding = async <T = unknown>(
  companyId: string,
  { data, logo, video }: UpdateCompanyBrandingPayload
) =>
  nextServerFetch<ApiResponse<T>>(`/company/${companyId}/branding`, {
    method: "PATCH",
    body: createMultipartBody(data, { logo, video }),
    updateTag: ["companies", `company-${companyId}`],
  });

export const deleteCompany = async <T = unknown>(companyId: string) =>
  nextServerFetch<ApiResponse<T>>(`/company/${companyId}`, {
    method: "DELETE",
    updateTag: ["companies", `company-${companyId}`],
  });
