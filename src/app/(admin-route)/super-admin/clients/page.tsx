import { AddClientModal } from "@/components/super-admin/clients/AddClientModal";
import { columns } from "@/components/super-admin/clients/ClientColumn";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DataTable } from "@/components/ui/custom/data-table";
import type { TSearchParams } from "@/lib/types/global.type";
import { getCompanies } from "@/services/company.service";

export default async function ClientPage({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  const params = await searchParams;
  const response = await getCompanies(params);

  if (!response.success) {
    throw new Error(response.message || "Unable to load clients");
  }

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Client Management"
          description="View client companies and control their platform access."
        >
          <AddClientModal>
            <Button>Add Client</Button>
          </AddClientModal>
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
            searchPlaceholder="Search clients..."
          />
        </div>
      </DashboardPageLayout>
    </div>
  );
}
