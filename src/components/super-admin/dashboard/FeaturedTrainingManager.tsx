"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LearningModule } from "@/lib/types/module.type";
import type { FeaturedTraining, Training, Topic } from "@/lib/types/training.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import {
  createFeaturedTraining,
  removeFeaturedTraining,
} from "@/services/training.service";

type FeaturedTrainingManagerProps = {
  modules: LearningModule[];
  featuredTrainings: FeaturedTraining[];
  errorMessage?: string;
};

const getModule = (item: FeaturedTraining) =>
  typeof item.moduleId === "string" ? null : item.moduleId;

const getTraining = (item: FeaturedTraining) =>
  typeof item.trainingId === "string" ? null : (item.trainingId as Training);

const getTopic = (item: FeaturedTraining) =>
  typeof item.topicId === "string" ? null : (item.topicId as Topic);

export function FeaturedTrainingManager({
  modules,
  featuredTrainings,
  errorMessage,
}: FeaturedTrainingManagerProps) {
  const router = useRouter();
  const [moduleId, setModuleId] = useState("");
  const [customText, setCustomText] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [removingId, setRemovingId] = useState<string>();

  const activeFeaturedTrainings = useMemo(
    () => featuredTrainings.filter((item) => item.isActive && !item.isDeleted),
    [featuredTrainings],
  );

  const featuredModuleIds = useMemo(
    () =>
      new Set(
        activeFeaturedTrainings.map((item) =>
          typeof item.moduleId === "string" ? item.moduleId : item.moduleId._id,
        ),
      ),
    [activeFeaturedTrainings],
  );

  const availableModules = modules.filter(
    (module) => !featuredModuleIds.has(module._id),
  );

  const handleCreate = async () => {
    const text = customText.trim();

    if (!moduleId) {
      ErrorToast("Select a module to feature.");
      return;
    }

    if (!text) {
      ErrorToast("Add the featured message shown to learners.");
      return;
    }

    setIsCreating(true);

    try {
      const response = await createFeaturedTraining({ moduleId, customText: text });

      if (!response.success) throw new Error(response.message);

      SuccessToast(response.message || "Featured training created successfully.");
      setModuleId("");
      setCustomText("");
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error
          ? error.message
          : "Unable to create featured training.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleRemove = async (featuredTrainingId: string) => {
    const confirmed = window.confirm(
      "Remove this featured training from the learner home screen?",
    );

    if (!confirmed) return;

    setRemovingId(featuredTrainingId);

    try {
      const response = await removeFeaturedTraining(featuredTrainingId);

      if (!response.success) throw new Error(response.message);

      SuccessToast(response.message || "Featured training removed successfully.");
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error
          ? error.message
          : "Unable to remove featured training.",
      );
    } finally {
      setRemovingId(undefined);
    }
  };

  return (
    <section className="space-y-4 rounded-md border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <h2 className="font-heading text-lg font-bold">Featured training</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Highlight an assigned module above the learner&apos;s normal training list.
          </p>
        </div>
        <Badge variant="secondary">
          {activeFeaturedTrainings.length} active
        </Badge>
      </div>

      {errorMessage && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive-foreground">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] lg:items-end">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="featured-module">
            Module
          </label>
          <Select value={moduleId} onValueChange={setModuleId}>
            <SelectTrigger id="featured-module" className="w-full">
              <SelectValue placeholder="Select an assigned module" />
            </SelectTrigger>
            <SelectContent>
              {availableModules.map((module) => (
                <SelectItem key={module._id} value={module._id}>
                  {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="featured-custom-text">
            Learner message
          </label>
          <Textarea
            id="featured-custom-text"
            value={customText}
            onChange={(event) => setCustomText(event.target.value)}
            placeholder="This is a must-complete training for this week!"
            className="min-h-10 resize-none"
          />
        </div>

        <Button
          type="button"
          onClick={() => void handleCreate()}
          disabled={isCreating || availableModules.length === 0}
        >
          {isCreating ? <Loader2 className="animate-spin" /> : <Sparkles />}
          Feature module
        </Button>
      </div>

      {availableModules.length === 0 && modules.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Every available assigned module is already featured.
        </p>
      )}

      <div className="space-y-2">
        {activeFeaturedTrainings.length === 0 ? (
          <div className="rounded-md border border-dashed p-5 text-center text-sm text-muted-foreground">
            No featured training is active.
          </div>
        ) : (
          activeFeaturedTrainings.map((item) => {
            const module = getModule(item);
            const training = getTraining(item);
            const topic = getTopic(item);

            return (
              <article
                key={item._id}
                className="flex flex-col gap-3 rounded-md border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="active">Featured</Badge>
                    {training?.title && (
                      <Badge variant="outline">{training.title}</Badge>
                    )}
                    {topic?.title && (
                      <Badge variant="secondary">{topic.title}</Badge>
                    )}
                  </div>
                  <p className="truncate font-medium">
                    {module?.title || "Featured module"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.customText || "Featured learning module"}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={removingId === item._id}
                  onClick={() => void handleRemove(item._id)}
                  className="shrink-0"
                >
                  {removingId === item._id ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash2 />
                  )}
                  Remove
                </Button>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
