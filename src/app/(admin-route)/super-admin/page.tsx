import { companyBreakdownColumns } from "@/components/super-admin/dashboard/CompanyBreakdownColumn";
import { DashboardStats } from "@/components/super-admin/dashboard/DashboardStats";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DataTable } from "@/components/ui/custom/data-table";
import { getAdminDashboard } from "@/services/dashboard.service";

export default async function SuperAdminDashboardPage() {
  const response = await getAdminDashboard();

  if (!response.success) {
    throw new Error(response.message || "Unable to load dashboard data");
  }

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="ActInc Platform Overview"
          description="Real-time overview of client companies, employees, and learning modules."
        />

        <DashboardStats data={response.data.stats} />

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
