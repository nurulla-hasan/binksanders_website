import { BroadcastForm } from "@/components/super-admin/broadcast/BroadcastForm";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { getCompanyDropdown } from "@/services/company.service";

export default async function BroadcastPage() {
  const response = await getCompanyDropdown();

  if (!response.success) {
    throw new Error(response.message || "Unable to load companies");
  }

  return (
    <DashboardPageLayout>
      <BroadcastForm companies={response.data} />
    </DashboardPageLayout>
  );
}
