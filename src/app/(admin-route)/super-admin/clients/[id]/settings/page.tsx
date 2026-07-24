import Link from "next/link";
import { ArrowLeft, Building2, Mail, MapPin } from "lucide-react";
import { ClientDetailsActions } from "@/components/super-admin/clients/ClientDetailsActions";
import { AssignModulesModal } from "@/components/super-admin/clients/AssignModulesModal";
import { AssignedModulesCompliance } from "@/components/super-admin/clients/AssignedModulesCompliance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import type { TParams } from "@/lib/types/global.type";
import { formatDate, getInitials } from "@/lib/utils";
import { getCompany } from "@/services/company.service";
import { getCompanyModules, getModules } from "@/services/module.service";
import { getCompanyTeams } from "@/services/team.service";

export default async function CompanySettingsPage({
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
  const [modulesResult, assignedResult, teamsResult] = await Promise.allSettled([
    getModules({ limit: 100 }),
    getCompanyModules(company._id),
    getCompanyTeams(company._id, { limit: 100 }),
  ]);

  const modules =
    modulesResult.status === "fulfilled" && modulesResult.value.success
      ? modulesResult.value.data
      : [];
  const assignedModules =
    assignedResult.status === "fulfilled" && assignedResult.value.success
      ? assignedResult.value.data
      : [];
  const teams =
    teamsResult.status === "fulfilled" && teamsResult.value.success
      ? teamsResult.value.data.result.map(({ _id, name }) => ({ _id, name }))
      : [];

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Company Settings"
          description="Manage company information, branding, modules, and platform access."
        >
          <Button asChild variant="outline" size="sm">
            <Link href={`/super-admin/clients/${company._id}`}>
              <ArrowLeft />
              Back to Analytics
            </Link>
          </Button>
        </DashboardHeader>

        <section className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-5 border-b border-border p-6 sm:flex-row sm:items-center">
            <Avatar className="size-20">
              {(company.image || company.logo) && (
                <AvatarImage src={company.image || company.logo} alt={company.firstName || company.fullName || company.name || "Company"} />
              )}
              <AvatarFallback>{getInitials(company.firstName || company.fullName || company.name || "Company")}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  {company.firstName || company.fullName || company.name || "Company"}
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
            <Detail
              label="Created"
              value={formatDate(company.createdAt)}
              icon={<Building2 />}
            />
            <Detail
              label="Updated"
              value={formatDate(company.updatedAt)}
              icon={<Building2 />}
            />
          </div>
        </section>

        <section className="rounded-md border border-border bg-card p-6 shadow-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Branding
          </h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ColorDetail
              label="Primary Color"
              color={company.branding?.primaryColor || "#8ACDDE"}
            />
            <ColorDetail
              label="Secondary Color"
              color={company.branding?.secondaryColor || "#E9308F"}
            />
            <Detail
              label="Video Title"
              value={company.branding?.videoTitle || "Not set"}
            />
            <Detail
              label="Presenter"
              value={company.branding?.presenterName || "Not set"}
            />
          </div>
        </section>

        <AssignedModulesCompliance
          companyId={company._id}
          modules={assignedModules}
          action={
            <AssignModulesModal
              companyId={company._id}
              teams={teams}
              modules={modules}
              assignedModuleIds={assignedModules.map((module) => module._id)}
            />
          }
        />
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
      {icon && (
        <div className="mt-0.5 text-muted-foreground [&_svg]:size-4">{icon}</div>
      )}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 wrap-break-word text-sm font-medium text-foreground">
          {value}
        </p>
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
        <span
          className="size-6 rounded-full border border-border"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-medium text-foreground">
          {color || "Not set"}
        </span>
      </div>
    </div>
  );
}
