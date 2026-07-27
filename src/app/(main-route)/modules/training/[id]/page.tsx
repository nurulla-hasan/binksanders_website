import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { TParams } from "@/lib/types/global.type";
import type { Topic, UserTrainingView } from "@/lib/types/training.type";
import { getTrainingTopics, getUserTrainingView } from "@/services/training.service";

const TrainingUnavailable = ({ message }: { message: string }) => (
  <div className="flex flex-1 min-h-0 flex-col gap-4 pb-8 animate-fadeIn overflow-y-auto pr-1">
    <Button asChild variant="ghost">
      <Link href="/modules">
        <ArrowLeft /> Back to trainings
      </Link>
    </Button>
    <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border bg-card px-6 text-center">
      <BookOpen className="mb-3 size-9 text-primary" />
      <h1 className="font-heading text-xl font-bold">Training unavailable</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  </div>
);

export default async function TrainingModulesPage({
  params,
}: {
  params: TParams<{ id: string }>;
}) {
  const { id } = await params;
  const [trainingResult, topicsResult] = await Promise.allSettled([
    getUserTrainingView(id),
    getTrainingTopics(id),
  ]);

  if (trainingResult.status === "rejected") {
    const message =
      trainingResult.reason instanceof Error
        ? trainingResult.reason.message
        : "Unable to load this training.";

    return <TrainingUnavailable message={message} />;
  }

  const trainingResponse = trainingResult.value;
  const topicsResponse =
    topicsResult.status === "fulfilled" ? topicsResult.value : undefined;

  if (!trainingResponse?.success) {
    return (
      <TrainingUnavailable
        message={trainingResponse?.message || "Unable to load this training."}
      />
    );
  }

  const training = trainingResponse.data as UserTrainingView;
  const topics: Topic[] =
    topicsResponse?.success && topicsResponse.data.length > 0
      ? topicsResponse.data
      : training.topics || [];

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-4 pb-8 animate-fadeIn overflow-y-auto pr-1">
      <Button asChild variant="ghost">
        <Link href="/modules">
          <ArrowLeft /> Back to trainings
        </Link>
      </Button>

      <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
        {training.thumbnailImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={training.thumbnailImage}
            alt={training.title}
            className="h-40 w-full object-cover"
          />
        )}
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={training.status === "published" ? "active" : "outline"}>
              {training.status}
            </Badge>
            <Badge variant="secondary">{topics.length} topics</Badge>
          </div>
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-bold">{training.title}</h1>
            <p className="text-sm text-muted-foreground">
              {training.description || "Training overview"}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {topics.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border bg-card px-6 text-center">
            <BookOpen className="mb-3 size-9 text-primary" />
            <h2 className="font-heading text-lg font-bold">No topics available</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Topics and modules will appear here when this training is configured.
            </p>
          </div>
        ) : (
          topics.map((topic) => (
            <article key={topic._id} className="space-y-4 rounded-lg border bg-card p-5 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Topic {(topic.order ?? 0) + 1}</Badge>
                  <Badge variant="secondary">
                    {topic.moduleCount ?? topic.modules?.length ?? 0} modules
                  </Badge>
                </div>
                <h2 className="font-heading text-xl font-bold">{topic.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {topic.description || "No description"}
                </p>
              </div>

              <div className="space-y-3">
                {(topic.modules || []).length > 0 ? (
                  topic.modules?.map((module) => {
                    const progress = module.userProgress;
                    const percentage = progress?.progressPercentage ?? 0;
                    const isCompleted = progress?.status === "completed" || percentage >= 100;

                    return (
                      <div key={module._id} className="space-y-3 rounded-md border bg-background p-4">
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
                            <h3 className="font-heading text-base font-bold">{module.title}</h3>
                            <p className="line-clamp-2 text-xs text-muted-foreground">
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
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-md border border-dashed p-5 text-center text-sm text-muted-foreground">
                    No modules in this topic yet.
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}



