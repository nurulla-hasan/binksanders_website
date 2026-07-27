import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { TParams } from "@/lib/types/global.type";
import { getTrainingTopic } from "@/services/training.service";

const TopicUnavailable = ({ trainingId, message }: { trainingId: string; message: string }) => (
  <div className="flex flex-1 min-h-0 flex-col gap-4 pb-8 animate-fadeIn overflow-y-auto pr-1">
    <Button asChild variant="ghost">
      <Link href={`/modules/training/${trainingId}`}>
        <ArrowLeft /> Back to topics
      </Link>
    </Button>
    <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border bg-card px-6 text-center">
      <BookOpen className="mb-3 size-9 text-primary" />
      <h1 className="font-heading text-xl font-bold">Topic unavailable</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  </div>
);

export default async function TopicModulesPage({
  params,
}: {
  params: TParams<{ id: string; topicId: string }>;
}) {
  const { id, topicId } = await params;
  const response = await getTrainingTopic(id, topicId).catch((error: unknown) => ({
    success: false,
    message: error instanceof Error ? error.message : "Unable to load this topic.",
    data: null,
  }));

  if (!response.success || !response.data) {
    return (
      <TopicUnavailable
        trainingId={id}
        message={response.message || "Unable to load this topic."}
      />
    );
  }

  const topic = response.data;
  const modules = topic.modules || [];

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-4 pb-8 animate-fadeIn overflow-y-auto pr-1">
      <Button asChild variant="ghost">
        <Link href={`/modules/training/${id}`}>
          <ArrowLeft /> Back to topics
        </Link>
      </Button>

      <section className="space-y-2 rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Topic {(topic.order ?? 0) + 1}</Badge>
          <Badge variant="secondary">{topic.moduleCount ?? modules.length} modules</Badge>
        </div>
        <h1 className="font-heading text-2xl font-bold">{topic.title}</h1>
        <p className="text-sm text-muted-foreground">
          {topic.description || "No description"}
        </p>
      </section>

      <section className="space-y-3">
        {modules.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border bg-card px-6 text-center">
            <Layers3 className="mb-3 size-9 text-primary" />
            <h2 className="font-heading text-lg font-bold">No modules available</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Modules will appear here when this topic is configured.
            </p>
          </div>
        ) : (
          modules.map((module) => {
            const progress = module.userProgress;
            const percentage = progress?.progressPercentage ?? 0;
            const isCompleted = progress?.status === "completed" || percentage >= 100;

            return (
              <article key={module._id} className="space-y-3 rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={isCompleted ? "active" : "outline"}>
                        {progress?.status?.replaceAll("_", " ") || "not started"}
                      </Badge>
                      <Badge variant="secondary">
                        {progress?.totalQuestions ?? module.totalQuestions ?? 0} questions
                      </Badge>
                    </div>
                    <h2 className="font-heading text-lg font-bold leading-tight">
                      {module.title}
                    </h2>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {module.description || "Learning module"}
                    </p>
                  </div>
                  <Link
                    href={`/modules/${module._id}`}
                    className="group flex shrink-0 items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    {isCompleted ? "Review" : percentage > 0 ? "Continue" : "Start"}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <div className="space-y-1.5">
                  <Progress value={percentage} />
                  <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>
                      {progress?.completedQuestions ?? 0} of{" "}
                      {progress?.totalQuestions ?? module.totalQuestions ?? 0} complete
                    </span>
                    <span>{Math.round(percentage)}%</span>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
