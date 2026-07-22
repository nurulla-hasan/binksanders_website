import type { TMeta } from "./global.type";

export type CreateTeamPayload = {
  name: string;
  companyId: string;
  passcode: string;
};

export type Team = {
  _id: string;
  name: string;
  companyId: string;
  passcode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TeamListData = {
  meta: TMeta;
  result: Team[];
};

export type TeamDropdownItem = Pick<Team, "_id" | "name">;

export type TeamRow = Team & {
  companyName: string;
};

export type UpdateTeamPayload = {
  name?: string;
  passcode?: string;
};
