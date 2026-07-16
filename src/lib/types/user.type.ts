import type { ProfilePayload } from "./api.type";

export type UpdateUserProfilePayload = {
  data: ProfilePayload;
  image?: Blob;
};
