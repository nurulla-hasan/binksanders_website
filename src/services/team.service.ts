"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";
import type { TQuery } from "@/lib/types/global.type";
import type { CreateTeamPayload, TeamListData, UpdateTeamPayload } from "@/lib/types/team.type";

export const createTeam = async <T = unknown>(payload: CreateTeamPayload) =>
  nextServerFetch<ApiResponse<T>>("/team/create-team", {
    method: "POST",
    body: payload,
    updateTag: "teams",
  });

export const getTeams = async (params: TQuery = {}) =>
  nextServerFetch<ApiResponse<TeamListData>>(`/team${buildQueryString(params)}`, {
    tags: ["teams"],
  });

export const getCompanyTeams = async (
  companyId: string,
  params: TQuery = {}
) =>
  nextServerFetch<ApiResponse<TeamListData>>(
    `/team/company/${companyId}${buildQueryString(params)}`,
    { tags: ["teams", `company-${companyId}-teams`] }
  );

export const getCompanyTeamDropdown = async <T = unknown>(
  companyId: string,
  params: TQuery = {}
) =>
  nextServerFetch<ApiResponse<T>>(
    `/team/company/${companyId}/dropdown${buildQueryString(params)}`,
    { tags: ["teams", `company-${companyId}-teams`] }
  );

export const updateTeam = async <T = unknown>(
  teamId: string,
  payload: UpdateTeamPayload
) =>
  nextServerFetch<ApiResponse<T>>(`/team/${teamId}`, {
    method: "PATCH",
    body: payload,
    updateTag: ["teams", `team-${teamId}`],
  });

export const deleteTeam = async <T = unknown>(teamId: string) =>
  nextServerFetch<ApiResponse<T>>(`/team/${teamId}`, {
    method: "DELETE",
    updateTag: ["teams", `team-${teamId}`],
  });
