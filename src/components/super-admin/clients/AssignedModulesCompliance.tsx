"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Layers3, Unlink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/custom/confirmation-modal";
import type { LearningModule } from "@/lib/types/module.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { unassignModule } from "@/services/module.service";

type AssignedModulesComplianceProps = {
  companyId: string;
  modules: LearningModule[];
  action?: ReactNode;
};

export function AssignedModulesCompliance({
  companyId,
  modules,
  action,
}: AssignedModulesComplianceProps) {
  const groupedModules = modules.reduce(
    (groups, module) => {
      const teamId = module.teamId?._id || "unassigned";
      const currentGroup = groups.get(teamId);

      if (currentGroup) {
        currentGroup.modules.push(module);
      } else {
        groups.set(teamId, {
          teamName: module.teamId?.name || "Other modules",
          modules: [module],
        });
      }

      return groups;
    },
    new Map<string, { teamName: string; modules: LearningModule[] }>(),
  );

  return (
    <section className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-muted/20 px-5 py-4">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-primary" />
          <h2 className="font-heading font-bold text-foreground">
            Assigned Modules
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {modules.length} {modules.length === 1 ? "module" : "modules"}
          </Badge>
          {action}
        </div>
      </div>

      {modules.length > 0 ? (
        <div className="space-y-6 p-5">
          {Array.from(groupedModules.entries()).map(
            ([teamId, { teamName, modules: teamModules }]) => (
              <div key={teamId} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Layers3 className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">{teamName}</h3>
                  <span className="text-xs text-muted-foreground">
                    ({teamModules.length})
                  </span>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  {teamModules.map((module) => (
                    <div
                      key={module._id}
                      className="flex items-center gap-3 rounded-md border border-border/70 bg-muted/10 p-4"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <BookOpen className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {module.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge
                            variant={
                              module.status === "published"
                                ? "success"
                                : "progress"
                            }
                            className="capitalize"
                          >
                            {module.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {module.questions.length} questions
                          </span>
                        </div>
                      </div>
                      <UnassignButton
                        companyId={companyId}
                        module={module}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </div>
          <h3 className="mt-4 font-heading font-bold">No modules assigned</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Assign modules to a team and they will appear here.
          </p>
        </div>
      )}
    </section>
  );
}

function UnassignButton({
  companyId,
  module,
}: {
  companyId: string;
  module: LearningModule;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleUnassign = async () => {
    setIsPending(true);

    try {
      const response = await unassignModule(module._id, companyId);
      if (!response.success) throw new Error(response.message);

      SuccessToast(response.message || "Module unassigned successfully");
      setIsOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to unassign module",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ConfirmationModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Unassign module?"
      description={`Remove ${module.title} from ${module.teamId?.name || "this company"}?`}
      confirmText="Unassign"
      loadingText="Unassigning..."
      onConfirm={handleUnassign}
      isLoading={isPending}
      variant="destructive"
      actionTrigger={
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Unassign ${module.title}`}
          title="Unassign module"
        >
          <Unlink />
        </Button>
      }
    />
  );
}
