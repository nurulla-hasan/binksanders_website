import Link from "next/link";
import { ArrowLeft, Building2, Mail, MapPin } from "lucide-react";
import { ClientDetailsActions } from "@/components/super-admin/clients/ClientDetailsActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import type { TParams } from "@/lib/types/global.type";
import { formatDate, getInitials } from "@/lib/utils";
import { getCompany } from "@/services/company.service";

export default async function CompanyDetailsPage({
  params,
}: {
  params: TParams<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getCompany(id);

  if (!response.success) {
    throw new Error(response.message || "Unable to load company");
  }

  const company = response.data;

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Company Details"
          description="Manage company information, branding, and platform access."
        >
          <Button asChild variant="outline" size="sm">
            <Link href="/super-admin/clients">
              <ArrowLeft />
              Back to Clients
            </Link>
          </Button>
        </DashboardHeader>

        <section className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-5 border-b border-border p-6 sm:flex-row sm:items-center">
            <Avatar className="size-20">
              {company.logo && (
                <AvatarImage src={company.logo} alt={company.name} />
              )}
              <AvatarFallback>{getInitials(company.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  {company.name}
                </h2>
                <Badge variant={company.status === "active" ? "active" : "blocked"}>
                  {company.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{company.slug}</p>
            </div>
            <ClientDetailsActions company={company} />
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <Detail label="Email" value={company.email} icon={<Mail />} />
            <Detail label="Address" value={company.address || "—"} icon={<MapPin />} />
            <Detail label="Created" value={formatDate(company.createdAt)} icon={<Building2 />} />
            <Detail label="Updated" value={formatDate(company.updatedAt)} icon={<Building2 />} />
          </div>
        </section>

        <section className="rounded-md border border-border bg-card p-6 shadow-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Branding
          </h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ColorDetail label="Primary Color" color={company.branding.primaryColor} />
            <ColorDetail label="Secondary Color" color={company.branding.secondaryColor} />
            <Detail label="Video Title" value={company.branding.videoTitle || "Not set"} />
            <Detail label="Presenter" value={company.branding.presenterName || "Not set"} />
          </div>
        </section>
      </DashboardPageLayout>
    </div>
  );
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      {icon && <div className="mt-0.5 text-muted-foreground [&_svg]:size-4">{icon}</div>}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 wrap-break-word text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ColorDetail({ label, color }: { label: string; color: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span className="size-6 rounded-full border border-border" style={{ backgroundColor: color }} />
        <span className="text-sm font-medium text-foreground">{color || "Not set"}</span>
      </div>
    </div>
  );
}
