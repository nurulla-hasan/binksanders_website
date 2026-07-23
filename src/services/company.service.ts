"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { createMultipartBody } from "@/lib/createMultipartBody";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type {
  CompanyPayload,
  Company,
  CompanyApiItem,
  CompanyApiListData,
  CompanyListData,
  CompanyDropdownItem,
  PublicCompanyDropdownItem,
  CompanyStatus,
  UpdateCompanyBrandingPayload,
} from "@/lib/types/company.type";
import type { TQuery } from "@/lib/types/global.type";

const defaultBranding = {
  primaryColor: "#8ACDDE",
  secondaryColor: "#E9308F",
  videoTitle: "",
  videoDescription: "",
  presenterName: "",
  presenterDesignation: "",
  videoUrl: "",
};

const normalizeCompany = (item: CompanyApiItem): Company => ({
  _id: item._id,
  companyId: item.companyId,
  name: item.name || item.fullName || item.firstName || "Unnamed company",
  email: item.email || "",
  address: item.address || "",
  logo: item.logo || item.image || "",
  slug: item.slug || "",
  status: item.status || "active",
  isDeleted: item.isDeleted ?? false,
  branding: { ...defaultBranding, ...item.branding },
  createdAt: item.createdAt || "",
  updatedAt: item.updatedAt || "",
  __v: item.__v ?? 0,
  users: item.users,
  id: item.id || item._id,
});

const normalizeCompanyDropdown = (
  item: PublicCompanyDropdownItem
): CompanyDropdownItem => ({
  _id: item._id,
  companyId: item.companyId,
  name: item.name || item.firstName || "Unnamed company",
});

const normalizePublicCompanyDropdown = (
  item: PublicCompanyDropdownItem
): CompanyDropdownItem => ({
  ...normalizeCompanyDropdown(item),
  _id: item.companyId || item._id,
});

export const createCompany = async <T = unknown>(payload: CompanyPayload) =>
  nextServerFetch<ApiResponse<T>>("/company/create-company", {
    method: "POST",
    body: payload,
    updateTag: "companies",
  });

export const getCompanies = async (
  params: TQuery = {}
): Promise<ApiResponse<CompanyListData>> => {
  const response = await nextServerFetch<ApiResponse<CompanyApiListData>>(
    `/company${buildQueryString(params)}`,
    {
    tags: ["companies"],
    }
  );

  return {
    ...response,
    data: {
      meta: response.data.meta,
      result: response.data.result.map(normalizeCompany),
    },
  };
};

export const getCompanyDropdown = async (params: TQuery = {}) => {
  const response = await nextServerFetch<ApiResponse<PublicCompanyDropdownItem[]>>(
    `/company/dropdown${buildQueryString(params)}`,
    { tags: ["companies"] }
  );

  return {
    ...response,
    data: response.data.map(normalizeCompanyDropdown),
  };
};

export const getPublicCompanyDropdown = async () => {
  const response = await nextServerFetch<ApiResponse<PublicCompanyDropdownItem[]>>(
    "/company/dropdown",
    {
    isPublic: true,
    revalidate: 300,
    }
  );

  return {
    ...response,
    data: response.data.map(normalizePublicCompanyDropdown),
  };
};

export const getCompany = async (companyId: string) => {
  const response = await nextServerFetch<ApiResponse<CompanyApiItem>>(
    `/company/${companyId}`,
    {
    tags: ["companies", `company-${companyId}`],
    }
  );

  return {
    ...response,
    data: normalizeCompany(response.data),
  };
};

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
