import { AddTeamModal } from "@/components/super-admin/location-performance/AddTeamModal";
import { CompanyFilter } from "@/components/super-admin/location-performance/CompanyFilter";
import { columns } from "@/components/super-admin/location-performance/TeamColumn";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DataTable } from "@/components/ui/custom/data-table";
import type { TSearchParams } from "@/lib/types/global.type";
import type { TeamRow } from "@/lib/types/team.type";
import { getCompanyDropdown } from "@/services/company.service";
import { getCompanyTeams, getTeams } from "@/services/team.service";

export default async function TeamManagementPage({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  const params = await searchParams;
  const companyId = typeof params.companyId === "string" ? params.companyId : "";
  const teamParams = { ...params };
  delete teamParams.companyId;

  const [teamResponse, companyResponse] = await Promise.all([
    companyId ? getCompanyTeams(companyId, teamParams) : getTeams(teamParams),
    getCompanyDropdown(),
  ]);

  if (!teamResponse.success) {
    throw new Error(teamResponse.message || "Unable to load teams");
  }
  if (!companyResponse.success) {
    throw new Error(companyResponse.message || "Unable to load companies");
  }

  const companyNames = new Map(
    companyResponse.data.map((company) => [company._id, company.name]),
  );
  const teams: TeamRow[] = teamResponse.data.result.map((team) => ({
    ...team,
    companyName: companyNames.get(team.companyId) || "Unknown company",
  }));

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Location & Team"
          description="Create and manage client teams and their access passcodes."
        >
          <div className="flex flex-wrap items-center gap-2">
            <CompanyFilter companies={companyResponse.data} />
            <AddTeamModal companies={companyResponse.data} />
          </div>
        </DashboardHeader>

        <div className="rounded-md border border-border bg-card p-4 shadow-sm">
          <DataTable
            columns={columns}
            data={teams}
            meta={{
              page: teamResponse.data.meta.page,
              limit: teamResponse.data.meta.limit,
              total: teamResponse.data.meta.total,
              totalPages: teamResponse.data.meta.totalPage,
            }}
            limit={teamResponse.data.meta.limit}
            searchKey="searchTerm"
            searchPlaceholder="Search teams..."
          />
        </div>
      </DashboardPageLayout>
    </div>
  );
}
