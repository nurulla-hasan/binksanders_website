import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandingForm } from "@/components/super-admin/branding/BrandingForm";
import { BrandingCompanySelect } from "@/components/super-admin/branding/BrandingCompanySelect";
import { Button } from "@/components/ui/button";
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
    : "";

  if (!companyId) {
    return (
      <DashboardPageLayout>
        <DashboardHeader
          title="Client Branding Settings"
          description="Configure custom logos, brand colors, and onboarding videos."
        >
          <Button asChild variant="outline" size="sm">
            <Link href="/super-admin/clients">
              <ArrowLeft />
              Back to Clients
            </Link>
          </Button>
        </DashboardHeader>
        <div className="max-w-4xl rounded-md border border-border bg-card p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Client Company</p>
            <BrandingCompanySelect companies={dropdownResponse.data} />
          </div>
        </div>
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
      >
        <Button asChild variant="outline" size="sm">
          <Link href={`/super-admin/clients/${companyId}`}>
            <ArrowLeft />
            Back to Company
          </Link>
        </Button>
      </DashboardHeader>
      <BrandingForm
        key={companyId}
        company={companyResponse.data}
        companies={dropdownResponse.data}
        selectedCompanyId={companyId}
      />
    </DashboardPageLayout>
  );
}
