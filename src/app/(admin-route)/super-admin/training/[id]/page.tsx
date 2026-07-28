import { TrainingBuilder } from "@/components/super-admin/training/TrainingBuilder";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import type { TParams } from "@/lib/types/global.type";
import { getModules } from "@/services/module.service";
import { getTraining } from "@/services/training.service";
import { getCompanyTeamDropdown } from "@/services/team.service";
import type { TeamDropdownItem } from "@/lib/types/team.type";

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

  if (!trainingResponse.success || !trainingResponse.data) {
    throw new Error(trainingResponse.message || "Unable to load training");
  }

  let training = trainingResponse.data;

  if (typeof training.teamId === "string" && training.companyId) {
    const companyId = typeof training.companyId === "string" ? training.companyId : training.companyId._id;
    try {
      const teamsResponse = await getCompanyTeamDropdown<TeamDropdownItem[]>(companyId, { limit: 100 });
      if (teamsResponse.success && teamsResponse.data) {
        const team = teamsResponse.data.find(t => t._id === training.teamId);
        if (team) {
          training = {
            ...training,
            teamId: { _id: team._id, name: team.name }
          };
        }
      }
    } catch {
      // ignore fetching errors
    }
  }

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Training Builder"
          description="Manage topics and attach modules inside this training."
        />
        <TrainingBuilder
          training={training}
          modules={modulesResponse.success ? modulesResponse.data : []}
        />
      </DashboardPageLayout>
    </div>
  );
}
