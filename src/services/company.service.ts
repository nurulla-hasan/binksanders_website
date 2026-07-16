import { buildQueryString } from "@/lib/buildQueryString";
import { createMultipartBody } from "@/lib/createMultipartBody";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type {
  CompanyPayload,
  CompanyStatus,
  UpdateCompanyBrandingPayload,
} from "@/lib/types/company.type";
import type { TQuery } from "@/lib/types/global.type";

export const createCompany = <T = unknown>(payload: CompanyPayload) =>
  nextServerFetch<ApiResponse<T>>("/company/create-company", {
    method: "POST",
    body: payload,
    updateTag: "companies",
  });

export const getCompanies = <T = unknown>(params: TQuery = {}) =>
  nextServerFetch<ApiResponse<T>>(`/company${buildQueryString(params)}`, {
    tags: ["companies"],
  });

export const getCompanyDropdown = <T = unknown>(params: TQuery = {}) =>
  nextServerFetch<ApiResponse<T>>(
    `/company/dropdown${buildQueryString(params)}`,
    { tags: ["companies"] }
  );

export const getCompany = <T = unknown>(companyId: string) =>
  nextServerFetch<ApiResponse<T>>(`/company/${companyId}`, {
    tags: ["companies", `company-${companyId}`],
  });

export const updateCompany = <T = unknown>(
  companyId: string,
  payload: Partial<CompanyPayload>
) =>
  nextServerFetch<ApiResponse<T>>(`/company/${companyId}`, {
    method: "PATCH",
    body: payload,
    updateTag: ["companies", `company-${companyId}`],
  });

export const updateCompanyStatus = <T = unknown>(
  companyId: string,
  status: CompanyStatus
) =>
  nextServerFetch<ApiResponse<T>>(`/company/${companyId}/status`, {
    method: "PATCH",
    body: { status },
    updateTag: ["companies", `company-${companyId}`],
  });

export const updateCompanyBranding = <T = unknown>(
  companyId: string,
  { data, logo, video }: UpdateCompanyBrandingPayload
) =>
  nextServerFetch<ApiResponse<T>>(`/company/${companyId}/branding`, {
    method: "PATCH",
    body: createMultipartBody(data, { logo, video }),
    updateTag: ["companies", `company-${companyId}`],
  });

export const deleteCompany = <T = unknown>(companyId: string) =>
  nextServerFetch<ApiResponse<T>>(`/company/${companyId}`, {
    method: "DELETE",
    updateTag: ["companies", `company-${companyId}`],
  });
