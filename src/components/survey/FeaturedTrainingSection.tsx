import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FeaturedTraining, Topic, Training } from "@/lib/types/training.type";

export function FeaturedTrainingSection({
  featuredTrainings,
}: {
  featuredTrainings: FeaturedTraining[];
}) {
  const activeItems = featuredTrainings.filter(
    (item) =>
      item.isActive &&
      !item.isDeleted &&
      typeof item.moduleId !== "string",
  );

  if (activeItems.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-primary" />
        <div>
          <h2 className="font-heading text-lg font-bold">Featured training</h2>
          <p className="text-xs text-muted-foreground">
            Prioritised learning selected for your team.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {activeItems.map((item) => {
          const module =
            typeof item.moduleId === "string" ? null : item.moduleId;
          const training =
            typeof item.trainingId === "string"
              ? null
              : (item.trainingId as Training);
          const topic =
            typeof item.topicId === "string" ? null : (item.topicId as Topic);

          if (!module) return null;

          return (
            <article
              key={item._id}
              className="overflow-hidden rounded-lg border-2 border-primary/30 bg-primary/5 shadow-sm"
            >
              {module.thumbnailImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={module.thumbnailImage}
                  alt={module.title}
                  className="h-40 w-full border-b object-cover"
                />
              )}

              <div className="space-y-4 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="active">Featured</Badge>
                  {training?.title && (
                    <Badge variant="outline">{training.title}</Badge>
                  )}
                  {topic?.title && (
                    <Badge variant="secondary">{topic.title}</Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary">
                    {item.customText || "Recommended for your team"}
                  </p>
                  <h3 className="font-heading text-xl font-bold leading-tight">
                    {module.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {module.description || "Open this module to start learning."}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-md border bg-background p-3">
                  <span className="text-xs text-muted-foreground">
                    {module.questions?.length ?? 0} questions
                  </span>
                  <Link
                    href={`/modules/${module._id}`}
                    className="group flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                  >
                    Start featured module
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
