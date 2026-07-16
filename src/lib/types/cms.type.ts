export type AboutPayload = { aboutUs: string };
export type PrivacyPayload = { privacyPolicy: string };
export type TermsPayload = { termsCondition: string };

type CmsDocumentBase = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type AboutData = CmsDocumentBase & AboutPayload;
export type PrivacyData = CmsDocumentBase & PrivacyPayload;
export type TermsData = CmsDocumentBase & TermsPayload;

export type ContactPayload = {
  subject: string;
  email: string;
  message: string;
};
