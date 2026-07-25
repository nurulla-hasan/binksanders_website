"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import type { LearningModule } from "@/lib/types/module.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { assignModulesToCompany, getModules, getCompanyModules } from "@/services/module.service";
import type { TeamRow } from "@/lib/types/team.type";

type AssignTeamModuleModalProps = {
  team: TeamRow;
};

export function AssignTeamModuleModal({ team }: AssignTeamModuleModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [moduleIds, setModuleIds] = useState<string[]>([]);

  const [modules, setModules] = useState<LearningModule[]>([]);
  const [assignedModules, setAssignedModules] = useState<LearningModule[]>([]);

  const availableModules = useMemo(() => {
    const teamAssignedIds = assignedModules
      .filter((m) => m.teamId?._id === team._id)
      .map((m) => m._id);
    return modules.filter((module) => !teamAssignedIds.includes(module._id));
  }, [team._id, assignedModules, modules]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [modulesRes, assignedRes] = await Promise.all([
        getModules({ limit: 100 }),
        getCompanyModules(team.companyId),
      ]);
      if (modulesRes.success) setModules(modulesRes.data);
      if (assignedRes.success) setAssignedModules(assignedRes.data);
    } catch {
      ErrorToast("Failed to load modules");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      loadData();
    } else {
      if (!isPending) setModuleIds([]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (moduleIds.length === 0) {
      ErrorToast("Select at least one module");
      return;
    }

    setIsPending(true);

    try {
      const response = await assignModulesToCompany({
        companyId: team.companyId,
        teamId: team._id,
        moduleIds,
      });
      if (!response.success) throw new Error(response.message);

      SuccessToast(response.message || "Modules assigned successfully");
      setIsOpen(false);
      setModuleIds([]);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to assign modules",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ModalWrapper
      open={isOpen}
      onOpenChange={handleOpenChange}
      title={`Assign Modules to ${team.name}`}
      description="Choose one or more learning modules to assign to this team."
      actionTrigger={
        <Button type="button" variant="outline" size="icon" title="Assign Modules">
          <BookOpen />
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              Available Modules
            </label>
            <span className="text-xs text-muted-foreground">
              {moduleIds.length} selected
            </span>
          </div>

          <div>
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : availableModules.length > 0 ? (
              availableModules.map((module) => (
                <div
                  key={module._id}
                  className={`flex cursor-pointer items-start space-x-3 rounded-md border p-3 transition-colors ${moduleIds.includes(module._id)
                      ? "border-primary bg-primary/5"
                      : "border-input hover:bg-muted/50"
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const isChecked = moduleIds.includes(module._id);
                    setModuleIds((current) => {
                      if (!isChecked && !current.includes(module._id)) {
                        return [...current, module._id];
                      }
                      if (isChecked && current.includes(module._id)) {
                        return current.filter((id) => id !== module._id);
                      }
                      return current;
                    });
                  }}
                >
                  <input
                    type="checkbox"
                    checked={moduleIds.includes(module._id)}
                    readOnly
                    className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex flex-1 flex-col justify-between gap-1 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {module.title}
                      </p>
                      {module.description && (
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {module.description}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {module.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  No modules available
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  All modules are already assigned or none exist.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isLoading || availableModules.length === 0}>
            {isPending ? "Assigning..." : "Assign Selected"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
