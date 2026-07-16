export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
};

export type IdentifierPayload = {
  identifier: string;
};

export type PasswordChangePayload = {
  oldPassword: string;
  newPassword: string;
};

export type ResetPasswordPayload = IdentifierPayload & {
  otp: string;
  newPassword: string;
};

export type LoginPayload = IdentifierPayload & {
  password: string;
};

export type ProfilePayload = {
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
};
