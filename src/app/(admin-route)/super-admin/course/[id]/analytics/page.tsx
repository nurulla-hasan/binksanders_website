import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ModuleQuestionAnalytics } from "@/components/super-admin/analytics/ModuleQuestionAnalytics";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DataErrorBlock } from "@/components/ui/custom/data-error-block";
import type { TParams } from "@/lib/types/global.type";
import { getModuleQuestionAnalytics } from "@/services/analytics.service";
import { getModule } from "@/services/module.service";

export default async function ModuleAnalyticsPage({
  params,
}: {
  params: TParams<{ id: string }>;
}) {
  const { id } = await params;
  const [analyticsResult, moduleResult] = await Promise.allSettled([
    getModuleQuestionAnalytics(id),
    getModule(id),
  ]);

  const analyticsResponse =
    analyticsResult.status === "fulfilled" ? analyticsResult.value : null;
  const moduleResponse =
    moduleResult.status === "fulfilled" ? moduleResult.value : null;

  const errorMessage =
    analyticsResult.status === "rejected"
      ? analyticsResult.reason instanceof Error
        ? analyticsResult.reason.message
        : "Unable to load module analytics."
      : analyticsResponse && !analyticsResponse.success
        ? analyticsResponse.message
        : null;

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title={
            analyticsResponse?.success
              ? `${analyticsResponse.data.moduleTitle} analytics`
              : "Module analytics"
          }
          description="Review question-level response counts and group answer distributions."
        >
          <Button asChild variant="outline">
            <Link href="/super-admin/course">
              <ArrowLeft /> Back to modules
            </Link>
          </Button>
        </DashboardHeader>

        {!analyticsResponse?.success || errorMessage ? (
          <DataErrorBlock
            message={errorMessage || "Unable to load module analytics."}
          />
        ) : (
          <ModuleQuestionAnalytics
            analytics={analyticsResponse.data}
            module={moduleResponse?.success ? moduleResponse.data : null}
          />
        )}
      </DashboardPageLayout>
    </div>
  );
}
