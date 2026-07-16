import type { ProfilePayload } from "./api.type";

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
