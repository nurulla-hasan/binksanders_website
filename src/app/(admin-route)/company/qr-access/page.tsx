import { CompanyQrAccess } from "@/components/company/dashboard/CompanyQrAccess";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import type { TeamDropdownItem } from "@/lib/types/team.type";
import { getCompany } from "@/services/company.service";
import { getTeams } from "@/services/team.service";
import { getMyProfile } from "@/services/user.service";

export default async function CompanyQrAccessPage() {
  let companyId = "";
  let companyName = "Current company";
  let teams: TeamDropdownItem[] = [];

  try {
    const profileResponse = await getMyProfile();

    if (profileResponse.success) {
      companyId = profileResponse.data.companyId || "";
      companyName = profileResponse.data.fullName || companyName;
    }

    if (companyId) {
      const [companyResult, teamsResult] = await Promise.allSettled([
        getCompany(companyId),
        getTeams({ limit: 100 }),
      ]);

      if (
        companyResult.status === "fulfilled" &&
        companyResult.value.success
      ) {
        companyName = companyResult.value.data.name;
      }

      if (teamsResult.status === "fulfilled" && teamsResult.value.success) {
        teams = teamsResult.value.data.result.map(({ _id, name }) => ({
          _id,
          name,
        }));
      }
    }
  } catch {
    // The component renders a safe empty state when company data is unavailable.
  }

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="QR Access"
          description="Generate secure, time-limited login codes for your teams."
        />

        <CompanyQrAccess
          companyId={companyId}
          companyName={companyName}
          teams={teams}
        />
      </DashboardPageLayout>
    </div>
  );
}
