import type { ProfilePayload } from "./api.type";

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
