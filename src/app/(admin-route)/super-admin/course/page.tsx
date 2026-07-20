import Link from "next/link";
import { Plus } from "lucide-react";
import { columns } from "@/components/super-admin/course/ModuleColumn";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DataTable } from "@/components/ui/custom/data-table";
import type { TSearchParams } from "@/lib/types/global.type";
import { getModules } from "@/services/module.service";

export default async function CoursePage({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  const params = await searchParams;
  const response = await getModules(params);

  if (!response.success) {
    throw new Error(response.message || "Unable to load modules");
  }

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Module Directory"
          description="Manage and create custom learning modules."
        >
          <Button asChild>
            <Link href="/super-admin/course/create">
              <Plus /> Create Module
            </Link>
          </Button>
        </DashboardHeader>

        <div className="rounded-md border border-border bg-card p-4 shadow-sm">
          <DataTable
            columns={columns}
            data={response.data}
            meta={{
              page: response.meta.page,
              limit: response.meta.limit,
              total: response.meta.total,
              totalPages: response.meta.totalPage,
            }}
            limit={response.meta.limit}
            searchKey="searchTerm"
            searchPlaceholder="Search modules..."
          />
        </div>
      </DashboardPageLayout>
    </div>
  );
}
