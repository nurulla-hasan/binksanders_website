"use server";

import { updateTag } from "next/cache";
import { buildQueryString } from "@/lib/buildQueryString";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type { TQuery } from "@/lib/types/global.type";
import type {
  CreateTeamPayload,
  TeamDropdownItem,
  TeamListData,
  UpdateTeamPayload,
} from "@/lib/types/team.type";

export const createTeam = async <T = unknown>(payload: CreateTeamPayload) => {
  const response = await nextServerFetch<ApiResponse<T>>("/team/create-team", {
    method: "POST",
    body: payload,
  });
  if (response && response.success) {
    updateTag("teams");
  }
  return response;
};

export const getTeams = async (params: TQuery = {}) =>
  nextServerFetch<ApiResponse<TeamListData>>(`/team${buildQueryString(params)}`, {
    next: { tags: ["teams"] },
  });

export const getCompanyTeams = async (
  companyId: string,
  params: TQuery = {}
) =>
  nextServerFetch<ApiResponse<TeamListData>>(
    `/team/company/${companyId}${buildQueryString(params)}`,
    { next: { tags: ["teams", `company-${companyId}-teams`] } }
  );

export const getCompanyTeamDropdown = async <T = unknown>(
  companyId: string,
  params: TQuery = {}
) =>
  nextServerFetch<ApiResponse<T>>(
    `/team/company/${companyId}/dropdown${buildQueryString(params)}`,
    {
      cache: "no-store",
    },
  );

export const getPublicCompanyTeamDropdown = async (companyId: string) =>
  nextServerFetch<ApiResponse<TeamDropdownItem[]>>(
    `/team/company/${companyId}/dropdown`,
    {
      auth: "none",
      cache: "no-store",
    },
  );

export const updateTeam = async <T = unknown>(
  teamId: string,
  payload: UpdateTeamPayload
) => {
  const response = await nextServerFetch<ApiResponse<T>>(`/team/${teamId}`, {
    method: "PATCH",
    body: payload,
  });
  if (response && response.success) {
    updateTag("teams");
    updateTag(`team-${teamId}`);
  }
  return response;
};

export const deleteTeam = async <T = unknown>(teamId: string) => {
  const response = await nextServerFetch<ApiResponse<T>>(`/team/${teamId}`, {
    method: "DELETE",
  });
  if (response && response.success) {
    updateTag("teams");
    updateTag(`team-${teamId}`);
  }
  return response;
};
