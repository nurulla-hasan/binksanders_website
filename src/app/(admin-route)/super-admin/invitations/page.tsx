import { InvitationDirectory } from "@/components/super-admin/invitations/InvitationDirectory";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DataErrorBlock } from "@/components/ui/custom/data-error-block";
import type { TSearchParams } from "@/lib/types/global.type";
import {
  getTrainingInvitations,
  getTrainings,
} from "@/services/training.service";

export default async function InvitationsPage({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  const params = await searchParams;
  const trainingsResponse = await getTrainings({ limit: 100 });

  if (!trainingsResponse.success) {
    return (
      <DashboardPageLayout>
        <DashboardHeader
          title="Email Invitations"
          description="Review training invitations and send reminder emails."
        />
        <DataErrorBlock
          message={trainingsResponse.message || "Unable to load trainings."}
        />
      </DashboardPageLayout>
    );
  }

  const trainings = trainingsResponse.data || [];
  const requestedTrainingId =
    typeof params.trainingId === "string" ? params.trainingId : undefined;
  const selectedTrainingId = trainings.some(
    (training) => training._id === requestedTrainingId,
  )
    ? requestedTrainingId
    : trainings[0]?._id;
  const invitationResponse = selectedTrainingId
    ? await getTrainingInvitations(selectedTrainingId)
    : null;

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Email Invitations"
          description="Review email delivery status and resend training reminders."
        />
        <InvitationDirectory
          trainings={trainings}
          selectedTrainingId={selectedTrainingId}
          invitations={
            invitationResponse?.success ? invitationResponse.data || [] : []
          }
          errorMessage={
            invitationResponse && !invitationResponse.success
              ? invitationResponse.message || "Unable to load invitations."
              : undefined
          }
        />
      </DashboardPageLayout>
    </div>
  );
}
