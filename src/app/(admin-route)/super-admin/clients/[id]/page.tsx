import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { BehavioralChangeChart } from "@/components/super-admin/clients/BehavioralChangeChart";
import {
  LocationPerformanceTable,
  type LocationData,
} from "@/components/super-admin/clients/LocationPerformanceTable";
import { ModuleComplianceList } from "@/components/super-admin/clients/ModuleComplianceList";
import { StatCards } from "@/components/super-admin/clients/StatCards";
import type { TParams } from "@/lib/types/global.type";
import { formatDate, getInitials } from "@/lib/utils";
import { getCompanyAnalytics } from "@/services/company.service";

export default async function CompanyDetailsPage({
  params,
}: {
  params: TParams<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getCompanyAnalytics(id);

  if (!response.success) {
    throw new Error(response.message || "Unable to load company analytics");
  }

  const analytics = response.data;
  const teams: LocationData[] = analytics.teamPerformance.map((team) => ({
    team: team.teamName,
    activeUser: team.activeCount,
    progress: team.progressPercentage,
    avgScore: `${team.averageScore}%`,
  }));

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Company Details"
          description="Detailed overview of company performance and compliance."
        >
          <Button asChild variant="outline" size="sm">
            <Link href="/super-admin/clients">
              <ArrowLeft />
              Back to Clients
            </Link>
          </Button>
        </DashboardHeader>

        <section className="flex flex-col gap-5 rounded-md border bg-linear-to-r from-primary/5 to-transparent p-6 shadow-sm sm:flex-row sm:items-center">
          <Avatar className="size-20 border-2">
            <AvatarFallback className="text-2xl font-bold text-primary">
              {getInitials(analytics.company.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-heading text-2xl font-bold">
              {analytics.company.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {analytics.company.industry || "Industry not specified"} ·{" "}
              {analytics.company.employeeCount.toLocaleString()} employees ·
              Member since {formatDate(analytics.company.memberSince)}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/super-admin/clients/${id}/settings`}>
              <Settings />
              Company Settings
            </Link>
          </Button>
        </section>

        <StatCards {...analytics.stats} />

        <BehavioralChangeChart
          data={analytics.barChart.chartData}
          averageIncrease={analytics.barChart.averageIncreasePercentage}
          assessmentCount={analytics.barChart.assessmentCount}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <LocationPerformanceTable data={teams} />
          <ModuleComplianceList modules={analytics.moduleCompliance} />
        </div>
      </DashboardPageLayout>
    </div>
  );
}
