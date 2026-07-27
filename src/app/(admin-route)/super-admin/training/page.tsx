import Link from "next/link";
import { Plus } from "lucide-react";
import { columns } from "@/components/super-admin/training/TrainingColumn";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DataTable } from "@/components/ui/custom/data-table";
import type { TSearchParams } from "@/lib/types/global.type";
import { getTrainings } from "@/services/training.service";

export default async function TrainingPage({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  const params = await searchParams;
  const response = await getTrainings(params);

  if (!response.success) {
    throw new Error(response.message || "Unable to load trainings");
  }

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Training Directory"
          description="Create trainings, assign them to teams, and manage topic/module structure."
        >
          <Button asChild>
            <Link href="/super-admin/training/create">
              <Plus /> Create Training
            </Link>
          </Button>
        </DashboardHeader>

        <div className="rounded-md border border-border bg-card p-4 shadow-sm">
          <DataTable
            columns={columns}
            data={response.data}
            meta={
              response.meta
                ? {
                    page: response.meta.page,
                    limit: response.meta.limit,
                    total: response.meta.total,
                    totalPages: response.meta.totalPage,
                  }
                : undefined
            }
            limit={response.meta?.limit ?? 10}
            searchKey="searchTerm"
            searchPlaceholder="Search trainings..."
          />
        </div>
      </DashboardPageLayout>
    </div>
  );
}