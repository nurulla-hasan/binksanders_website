import type { IdentifierPayload } from "./api.type";

export type EmployeeIdLoginPayload = {
  employeeId: string;
  companyId: string;
  teamId: string;
  firstName: string;
  lastName: string;
};

export type GuestLoginPayload = {
  passcode: string;
  companyId: string;
  teamId: string;
};

export type QrLoginPayload = {
  qrToken: string;
  firstName: string;
  lastName: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
  companyId: string;
  teamId: string;
};

export type VerifyRegistrationOtpPayload = IdentifierPayload & {
  otp: string;
};

export type RefreshTokenPayload = {
  refreshToken: string;
  rememberMe?: boolean;
};
