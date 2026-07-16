import type { ProfilePayload } from "./api.type";
import type { TMeta } from "./global.type";

export type CurrentUser = {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  image: string;
  role: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type UpdateUserProfilePayload = {
  data: ProfilePayload;
  image?: Blob;
};

export type UserAccount = {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  image: string;
  email: string;
  authType: string;
  role: string;
  companyId: string;
  status: string;
  isOtpVerified: boolean;
  isDeleted: boolean;
  fcmToken: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserListData = {
  meta: TMeta;
  result: UserAccount[];
};
