import { TrainingBuilder } from "@/components/super-admin/training/TrainingBuilder";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import type { TParams } from "@/lib/types/global.type";
import { getModules } from "@/services/module.service";
import { getTraining } from "@/services/training.service";

export default async function TrainingDetailPage({
  params,
}: {
  params: TParams<{ id: string }>;
}) {
  const { id } = await params;
  const [trainingResponse, modulesResponse] = await Promise.all([
    getTraining(id),
    getModules({ limit: 100 }),
  ]);

  if (!trainingResponse.success) {
    throw new Error(trainingResponse.message || "Unable to load training");
  }

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Training Builder"
          description="Manage topics and attach modules inside this training."
        />
        <TrainingBuilder
          training={trainingResponse.data}
          modules={modulesResponse.success ? modulesResponse.data : []}
        />
      </DashboardPageLayout>
    </div>
  );
}
