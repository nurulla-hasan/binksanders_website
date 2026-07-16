import { AddAdminModal } from "@/components/super-admin/make-admin/AddAdminModal";
import { columns } from "@/components/super-admin/make-admin/AdminColumn";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DataTable } from "@/components/ui/custom/data-table";
import type { TSearchParams } from "@/lib/types/global.type";
import { getAdmins } from "@/services/admin.service";

export default async function MakeAdminPage({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  const params = await searchParams;
  const response = await getAdmins({ ...params, role: "admin" });

  if (!response.success) {
    throw new Error(response.message || "Unable to load administrators");
  }

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Administrators"
          description="Create administrators and control their system access."
        >
          <AddAdminModal>
            <Button>Make Admin</Button>
          </AddAdminModal>
        </DashboardHeader>

        <div className="rounded-md border border-border bg-card p-4 shadow-sm">
          <DataTable
            columns={columns}
            data={response.data.result}
            meta={{
              page: response.data.meta.page,
              limit: response.data.meta.limit,
              total: response.data.meta.total,
              totalPages: response.data.meta.totalPage,
            }}
            limit={response.data.meta.limit}
            searchKey="searchTerm"
            searchPlaceholder="Search administrators..."
          />
        </div>
      </DashboardPageLayout>
    </div>
  );
}
