import type { TMeta } from "./global.type";

export type CompanyPayload = {
  name: string;
  email: string;
  address: string;
};

export type CompanyBranding = {
  primaryColor: string;
  secondaryColor: string;
  videoTitle: string;
  videoDescription: string;
  presenterName: string;
  presenterDesignation: string;
  videoUrl: string;
};

export type CompanyUserSummary = {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: "company" | "user" | string;
  employeeId?: string;
  companyId: string;
  status: string;
};

export type Company = {
  _id: string;
  name: string;
  email: string;
  address: string;
  logo: string;
  slug: string;
  status: CompanyStatus;
  isDeleted: boolean;
  branding: CompanyBranding;
  createdAt: string;
  updatedAt: string;
  __v: number;
  users?: CompanyUserSummary[];
  id?: string;
};

export type CompanyListData = {
  meta: TMeta;
  result: Company[];
};

export type CompanyDropdownItem = Pick<Company, "_id" | "name">;

export type PublicCompanyDropdownItem = {
  _id: string;
  name?: string;
  firstName?: string;
  companyId?: string;
};

export type CompanyStatus = "active" | "inactive" | "suspended";

export type CompanyBrandingData = {
  primaryColor?: string;
  secondaryColor?: string;
  videoTitle?: string;
  videoDescription?: string;
  presenterName?: string;
  presenterDesignation?: string;
};

export type UpdateCompanyBrandingPayload = {
  data: CompanyBrandingData;
  logo?: Blob;
  video?: Blob;
};
