"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle, MailCheck, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataErrorBlock } from "@/components/ui/custom/data-error-block";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Training, TrainingInvitation } from "@/lib/types/training.type";
import { formatDate, ErrorToast, SuccessToast } from "@/lib/utils";
import { resendTrainingInvitation } from "@/services/training.service";

type InvitationDirectoryProps = {
  trainings: Training[];
  selectedTrainingId?: string;
  invitations: TrainingInvitation[];
  errorMessage?: string;
};

const getTrainingTitle = (
  training: TrainingInvitation["trainingId"],
  fallback?: string,
) => {
  if (typeof training === "object") return training.title;
  return fallback || training;
};

const getInvitationStatus = (invitation: TrainingInvitation) => {
  if (invitation.isUsed) {
    return { label: "Used", variant: "success" as const };
  }

  if (new Date(invitation.expiresAt).getTime() < Date.now()) {
    return { label: "Expired", variant: "destructive" as const };
  }

  return { label: "Pending", variant: "pending" as const };
};

export function InvitationDirectory({
  trainings,
  selectedTrainingId,
  invitations,
  errorMessage,
}: InvitationDirectoryProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sendingId, setSendingId] = useState<string | null>(null);
  const selectedTraining = trainings.find(
    (training) => training._id === selectedTrainingId,
  );

  const handleTrainingChange = (trainingId: string) => {
    const query = new URLSearchParams({ trainingId });
    router.push(`${pathname}?${query.toString()}`);
  };

  const handleResend = async (invitationId: string) => {
    setSendingId(invitationId);

    try {
      const response = await resendTrainingInvitation(invitationId);
      if (!response.success) throw new Error(response.message);

      SuccessToast(response.message || "Reminder email sent successfully");
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to send reminder",
      );
    } finally {
      setSendingId(null);
    }
  };

  if (trainings.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-md border bg-card px-6 text-center">
        <MailCheck className="mb-4 size-10 text-muted-foreground" />
        <h2 className="font-heading text-lg font-semibold">No trainings found</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a training before reviewing email invitations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-md border bg-card p-4 shadow-sm">
        <div className="max-w-md flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="invitation-training">
            Training
          </label>
          <Select
            value={selectedTrainingId}
            onValueChange={handleTrainingChange}
          >
            <SelectTrigger id="invitation-training" className="w-full">
              <SelectValue placeholder="Select a training" />
            </SelectTrigger>
            <SelectContent>
              {trainings.map((training) => (
                <SelectItem key={training._id} value={training._id}>
                  {training.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {errorMessage ? (
        <DataErrorBlock message={errorMessage} />
      ) : (
        <div className="overflow-hidden rounded-md border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-secondary px-4">Email</TableHead>
                <TableHead className="bg-secondary px-4">Training</TableHead>
                <TableHead className="bg-secondary px-4">Sent</TableHead>
                <TableHead className="bg-secondary px-4">Expires</TableHead>
                <TableHead className="bg-secondary px-4">Status</TableHead>
                <TableHead className="bg-secondary px-4 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-28 text-center">
                    No email invitations found for this training.
                  </TableCell>
                </TableRow>
              ) : (
                invitations.map((invitation) => {
                  const status = getInvitationStatus(invitation);
                  const isSending = sendingId === invitation._id;

                  return (
                    <TableRow key={invitation._id}>
                      <TableCell className="px-4 font-medium">
                        {invitation.email}
                      </TableCell>
                      <TableCell className="max-w-64 truncate px-4 text-muted-foreground">
                        {getTrainingTitle(
                          invitation.trainingId,
                          selectedTraining?.title,
                        )}
                      </TableCell>
                      <TableCell className="px-4 text-muted-foreground">
                        {formatDate(invitation.createdAt)}
                      </TableCell>
                      <TableCell className="px-4 text-muted-foreground">
                        {formatDate(invitation.expiresAt)}
                      </TableCell>
                      <TableCell className="px-4">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="px-4 text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isSending}
                          onClick={() => void handleResend(invitation._id)}
                        >
                          {isSending ? (
                            <LoaderCircle className="animate-spin" />
                          ) : (
                            <RefreshCcw />
                          )}
                          {isSending ? "Sending..." : "Send reminder"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
