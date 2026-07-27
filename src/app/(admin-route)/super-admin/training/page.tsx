import Link from "next/link";
import { Plus } from "lucide-react";
import { TrainingDirectoryTable } from "@/components/super-admin/training/TrainingDirectoryTable";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import type { TSearchParams } from "@/lib/types/global.type";
import { getCompanyDropdown } from "@/services/company.service";
import { getTrainings } from "@/services/training.service";

export default async function TrainingPage({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  const params = await searchParams;
  const [trainingResponse, companyResponse] = await Promise.all([
    getTrainings(params),
    getCompanyDropdown({ limit: 100 }),
  ]);

  if (!trainingResponse.success) {
    throw new Error(trainingResponse.message || "Unable to load trainings");
  }

  const companies = companyResponse.success ? companyResponse.data : [];

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
          <TrainingDirectoryTable
            trainings={trainingResponse.data}
            companies={companies}
            meta={
              trainingResponse.meta
                ? {
                    page: trainingResponse.meta.page,
                    limit: trainingResponse.meta.limit,
                    total: trainingResponse.meta.total,
                    totalPages: trainingResponse.meta.totalPage,
                  }
                : undefined
            }
            limit={trainingResponse.meta?.limit ?? 10}
          />
        </div>
      </DashboardPageLayout>
    </div>
  );
}