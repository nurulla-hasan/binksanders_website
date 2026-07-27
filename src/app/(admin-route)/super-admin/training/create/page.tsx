import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TrainingCreateForm } from "@/components/super-admin/training/TrainingCreateForm";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { getCompanyDropdown } from "@/services/company.service";
import { getTeams } from "@/services/team.service";

export default async function CreateTrainingPage() {
  const [companiesResponse, teamsResponse] = await Promise.all([
    getCompanyDropdown({ limit: 100 }),
    getTeams({ limit: 100 }),
  ]);

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Create Training"
          description="Assign one training to a company team and choose its login method."
        >
          <Button asChild variant="ghost">
            <Link href="/super-admin/training">
              <ArrowLeft /> Back
            </Link>
          </Button>
        </DashboardHeader>

        <div className="rounded-md border border-border bg-card p-5 shadow-sm">
          <TrainingCreateForm
            companies={companiesResponse.success ? companiesResponse.data : []}
            teams={teamsResponse.success ? teamsResponse.data.result : []}
          />
        </div>
      </DashboardPageLayout>
    </div>
  );
}