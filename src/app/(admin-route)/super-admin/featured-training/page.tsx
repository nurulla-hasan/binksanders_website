import { FeaturedTrainingManager } from "@/components/super-admin/dashboard/FeaturedTrainingManager";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { getFeaturedTrainings } from "@/services/featured-training.service";
import { getModules } from "@/services/module.service";

export default async function FeaturedTrainingPage() {
  const [modulesResult, featuredResult] = await Promise.allSettled([
    getModules({ limit: 100, status: "published" }),
    getFeaturedTrainings(),
  ]);

  const modules =
    modulesResult.status === "fulfilled" && modulesResult.value.success
      ? modulesResult.value.data.filter(
          (module) =>
            module.status === "published" &&
            Boolean(module.companyId) &&
            Boolean(module.topicId),
        )
      : [];

  const featuredTrainings =
    featuredResult.status === "fulfilled" && featuredResult.value.success
      ? featuredResult.value.data
      : [];

  const featuredErrorMessage =
    featuredResult.status === "rejected"
      ? featuredResult.reason instanceof Error
        ? featuredResult.reason.message
        : "Unable to load featured trainings."
      : featuredResult.value.success
        ? undefined
        : featuredResult.value.message || "Unable to load featured trainings.";

  const modulesErrorMessage =
    modulesResult.status === "rejected"
      ? modulesResult.reason instanceof Error
        ? modulesResult.reason.message
        : "Unable to load assigned modules."
      : modulesResult.value.success
        ? undefined
        : modulesResult.value.message || "Unable to load assigned modules.";

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Featured Training"
          description="Choose assigned modules to highlight above each learner's normal training list."
        />

        <FeaturedTrainingManager
          modules={modules}
          featuredTrainings={featuredTrainings}
          errorMessage={featuredErrorMessage || modulesErrorMessage}
        />
      </DashboardPageLayout>
    </div>
  );
}
