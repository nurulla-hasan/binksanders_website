import { BrandingForm } from "@/components/super-admin/branding/BrandingForm";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import type { TSearchParams } from "@/lib/types/global.type";
import { getCompany, getCompanyDropdown } from "@/services/company.service";

export default async function ClientBrandingPage({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  const params = await searchParams;
  const dropdownResponse = await getCompanyDropdown();

  if (!dropdownResponse.success) {
    throw new Error(dropdownResponse.message || "Unable to load companies");
  }

  const requestedId = typeof params.companyId === "string" ? params.companyId : "";
  const companyId = dropdownResponse.data.some((item) => item._id === requestedId)
    ? requestedId
    : dropdownResponse.data[0]?._id;

  if (!companyId) {
    return (
      <DashboardPageLayout>
        <DashboardHeader
          title="Client Branding Settings"
          description="Create a client company before configuring branding."
        />
      </DashboardPageLayout>
    );
  }

  const companyResponse = await getCompany(companyId);

  if (!companyResponse.success) {
    throw new Error(companyResponse.message || "Unable to load company branding");
  }

  return (
    <DashboardPageLayout>
      <DashboardHeader
        title="Client Branding Settings"
        description="Configure custom logos, brand colors, and onboarding videos."
      />
      <BrandingForm
        key={companyResponse.data._id}
        company={companyResponse.data}
        companies={dropdownResponse.data}
      />
    </DashboardPageLayout>
  );
}
