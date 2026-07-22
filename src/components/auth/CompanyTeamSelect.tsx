"use client";

import { useEffect, useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CompanyDropdownItem } from "@/lib/types/company.type";
import type { TeamDropdownItem } from "@/lib/types/team.type";
import { ErrorToast } from "@/lib/utils";
import { getPublicCompanyDropdown } from "@/services/company.service";
import { getPublicCompanyTeamDropdown } from "@/services/team.service";

type CompanyTeamSelectProps = {
  companyId: string;
  teamId: string;
  onCompanyChange: (companyId: string) => void;
  onTeamChange: (teamId: string) => void;
  showLabels?: boolean;
};

export function CompanyTeamSelect({
  companyId,
  teamId,
  onCompanyChange,
  onTeamChange,
  showLabels = false,
}: CompanyTeamSelectProps) {
  const [companies, setCompanies] = useState<CompanyDropdownItem[]>([]);
  const [teams, setTeams] = useState<TeamDropdownItem[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadCompanies = async () => {
      try {
        const response = await getPublicCompanyDropdown();
        if (!response.success) throw new Error(response.message);
        if (!isCancelled) setCompanies(response.data);
      } catch (error: unknown) {
        if (!isCancelled) {
          ErrorToast(
            error instanceof Error
              ? error.message
              : "Unable to load companies"
          );
        }
      } finally {
        if (!isCancelled) setIsLoadingCompanies(false);
      }
    };

    void loadCompanies();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    if (!companyId) return;

    const loadTeams = async () => {
      setIsLoadingTeams(true);
      try {
        const response = await getPublicCompanyTeamDropdown(companyId);
        if (!response.success) throw new Error(response.message);
        if (!isCancelled) setTeams(response.data);
      } catch (error: unknown) {
        if (!isCancelled) {
          ErrorToast(
            error instanceof Error ? error.message : "Unable to load teams"
          );
        }
      } finally {
        if (!isCancelled) setIsLoadingTeams(false);
      }
    };

    void loadTeams();

    return () => {
      isCancelled = true;
    };
  }, [companyId]);

  const handleCompanyChange = (selectedCompanyId: string) => {
    setTeams([]);
    onTeamChange("");
    onCompanyChange(selectedCompanyId);
  };

  return (
    <>
      <Field>
        {showLabels && <FieldLabel>Company</FieldLabel>}
        <Select
          value={companyId}
          onValueChange={handleCompanyChange}
          disabled={isLoadingCompanies}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                isLoadingCompanies ? "Loading companies..." : "Select company"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company._id} value={company._id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        {showLabels && <FieldLabel>Team</FieldLabel>}
        <Select
          value={teamId}
          onValueChange={onTeamChange}
          disabled={!companyId || isLoadingTeams}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                isLoadingTeams
                  ? "Loading teams..."
                  : companyId
                    ? "Select team"
                    : "Select company first"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team._id} value={team._id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </>
  );
}
