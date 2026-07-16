import { buildQueryString } from "@/lib/buildQueryString";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type { TQuery } from "@/lib/types/global.type";
import type { CreateTeamPayload, UpdateTeamPayload } from "@/lib/types/team.type";

export const createTeam = <T = unknown>(payload: CreateTeamPayload) =>
  nextServerFetch<ApiResponse<T>>("/team/create-team", {
    method: "POST",
    body: payload,
    updateTag: "teams",
  });

export const getTeams = <T = unknown>(params: TQuery = {}) =>
  nextServerFetch<ApiResponse<T>>(`/team${buildQueryString(params)}`, {
    tags: ["teams"],
  });

export const getCompanyTeams = <T = unknown>(
  companyId: string,
  params: TQuery = {}
) =>
  nextServerFetch<ApiResponse<T>>(
    `/team/company/${companyId}${buildQueryString(params)}`,
    { tags: ["teams", `company-${companyId}-teams`] }
  );

export const getCompanyTeamDropdown = <T = unknown>(
  companyId: string,
  params: TQuery = {}
) =>
  nextServerFetch<ApiResponse<T>>(
    `/team/company/${companyId}/dropdown${buildQueryString(params)}`,
    { tags: ["teams", `company-${companyId}-teams`] }
  );

export const updateTeam = <T = unknown>(
  teamId: string,
  payload: UpdateTeamPayload
) =>
  nextServerFetch<ApiResponse<T>>(`/team/${teamId}`, {
    method: "PATCH",
    body: payload,
    updateTag: ["teams", `team-${teamId}`],
  });

export const deleteTeam = <T = unknown>(teamId: string) =>
  nextServerFetch<ApiResponse<T>>(`/team/${teamId}`, {
    method: "DELETE",
    updateTag: ["teams", `team-${teamId}`],
  });
