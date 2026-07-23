"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LearningModule } from "@/lib/types/module.type";
import type { TeamDropdownItem } from "@/lib/types/team.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { assignModulesToCompany } from "@/services/module.service";

type AssignModulesModalProps = {
  companyId: string;
  teams: TeamDropdownItem[];
  modules: LearningModule[];
  assignedModuleIds: string[];
};

export function AssignModulesModal({
  companyId,
  teams,
  modules,
  assignedModuleIds,
}: AssignModulesModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [moduleIds, setModuleIds] = useState<string[]>([]);
  const availableModules = useMemo(
    () => modules.filter((module) => !assignedModuleIds.includes(module._id)),
    [assignedModuleIds, modules],
  );

  const resetForm = () => {
    setTeamId("");
    setModuleIds([]);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && !isPending) resetForm();
  };

  const toggleModule = (moduleId: string, checked: boolean) => {
    setModuleIds((current) =>
      checked
        ? [...current, moduleId]
        : current.filter((id) => id !== moduleId),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!teamId) {
      ErrorToast("Please select a team");
      return;
    }

    if (moduleIds.length === 0) {
      ErrorToast("Select at least one module");
      return;
    }

    setIsPending(true);

    try {
      const response = await assignModulesToCompany({
        companyId,
        teamId,
        moduleIds,
      });
      if (!response.success) throw new Error(response.message);

      SuccessToast(response.message || "Modules assigned successfully");
      setIsOpen(false);
      resetForm();
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
      title="Assign Modules"
      description="Choose a team and assign one or more learning modules."
      actionTrigger={
        <Button type="button">
          <Plus />
          Assign Modules
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Field>
          <FieldLabel htmlFor="assignment-team">Team</FieldLabel>
          <Select value={teamId} onValueChange={setTeamId}>
            <SelectTrigger id="assignment-team" className="w-full">
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team._id} value={team._id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <div className="flex items-center justify-between gap-3">
            <FieldLabel>Modules</FieldLabel>
            <span className="text-xs text-muted-foreground">
              {moduleIds.length} selected
            </span>
          </div>

          {availableModules.length > 0 ? (
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {availableModules.map((module) => {
                const isChecked = moduleIds.includes(module._id);

                return (
                  <label
                    key={module._id}
                    className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        toggleModule(module._id, checked === true)
                      }
                      className="mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {module.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {module.description}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs capitalize text-muted-foreground">
                      {module.status}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-6 text-center">
              <BookOpen className="mx-auto size-6 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">No modules available</p>
              <p className="mt-1 text-xs text-muted-foreground">
                All existing modules are already assigned.
              </p>
            </div>
          )}
        </Field>

        {teams.length === 0 && (
          <p className="text-sm text-destructive">
            Add a team to this company before assigning modules.
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isPending ||
              teams.length === 0 ||
              availableModules.length === 0
            }
          >
            {isPending ? "Assigning..." : "Assign Selected"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
