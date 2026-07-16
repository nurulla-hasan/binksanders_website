import type { ProfilePayload } from "./api.type";

export type AdminRole = "superAdmin" | "admin";

export type AdminAccount = {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  image: string;
  role: AdminRole;
  status: "active" | "inactive" | "blocked";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type AdminLoginData = {
  accessToken: string;
  admin: AdminAccount;
};

export type AdminLoginResult = {
  role: AdminRole;
};

export type CreateAdminPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

export type UpdateAdminProfilePayload = {
  data: ProfilePayload;
  image?: Blob;
};
