export type CompanyPayload = {
  name: string;
  email: string;
  address: string;
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
