import { companyBreakdownColumns } from "@/components/super-admin/dashboard/CompanyBreakdownColumn";
import { DashboardStats } from "@/components/super-admin/dashboard/DashboardStats";
import { FeaturedTrainingManager } from "@/components/super-admin/dashboard/FeaturedTrainingManager";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DataTable } from "@/components/ui/custom/data-table";
import { getAdminDashboard } from "@/services/dashboard.service";
import { getFeaturedTrainings } from "@/services/featured-training.service";
import { getModules } from "@/services/module.service";

export default async function SuperAdminDashboardPage() {
  const [dashboardResult, modulesResult, featuredResult] =
    await Promise.allSettled([
      getAdminDashboard(),
      getModules({ limit: 100, status: "published" }),
      getFeaturedTrainings(),
    ]);

  if (dashboardResult.status === "rejected") {
    throw dashboardResult.reason;
  }

  const response = dashboardResult.value;

  if (!response.success) {
    throw new Error(response.message || "Unable to load dashboard data");
  }

  const modules =
    modulesResult.status === "fulfilled" && modulesResult.value.success
      ? modulesResult.value.data.filter(
          (module) =>
            module.status === "published" &&
            Boolean(module.companyId) &&
            Boolean(module.topicId),
        )
      : [];

  const featuredTrainings =
    featuredResult.status === "fulfilled" && featuredResult.value.success
      ? featuredResult.value.data
      : [];

  const featuredErrorMessage =
    featuredResult.status === "rejected"
      ? featuredResult.reason instanceof Error
        ? featuredResult.reason.message
        : "Unable to load featured trainings."
      : featuredResult.value.success
        ? undefined
        : featuredResult.value.message || "Unable to load featured trainings.";

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="ActInc Platform Overview"
          description="Real-time overview of client companies, employees, and learning modules."
        />

        <DashboardStats data={response.data.stats} />

        <FeaturedTrainingManager
          modules={modules}
          featuredTrainings={featuredTrainings}
          errorMessage={featuredErrorMessage}
        />

        <div className="rounded-md border bg-card p-4 shadow-sm">
          <DataTable
            columns={companyBreakdownColumns}
            data={response.data.companyBreakdown}
          />
        </div>
      </DashboardPageLayout>
    </div>
  );
}
