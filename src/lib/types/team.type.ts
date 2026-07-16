export type CreateTeamPayload = {
  name: string;
  companyId: string;
  passcode: string;
};

export type UpdateTeamPayload = {
  name?: string;
  passcode?: string;
};
