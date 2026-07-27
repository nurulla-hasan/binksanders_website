import Link from "next/link";
import { ArrowRight, BookOpen, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TParams } from "@/lib/types/global.type";
import type { Topic, UserTrainingView } from "@/lib/types/training.type";
import { getTrainingTopics, getUserTrainingView } from "@/services/training.service";

const TrainingUnavailable = ({ message }: { message: string }) => (
  <div className="flex flex-1 min-h-0 flex-col gap-4 pb-8 animate-fadeIn overflow-y-auto pr-1">
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

      <section className="space-y-3">
        {topics.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border bg-card px-6 text-center">
            <BookOpen className="mb-3 size-9 text-primary" />
            <h2 className="font-heading text-lg font-bold">No topics available</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Topics will appear here when this training is configured.
            </p>
          </div>
        ) : (
          topics.map((topic) => (
            <Link
              key={topic._id}
              href={`/modules/training/${id}/topics/${topic._id}`}
              className="group block rounded-lg border bg-card p-5 shadow-sm transition-colors hover:border-primary/50"
            >
              <article className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">Topic {(topic.order ?? 0) + 1}</Badge>
                    <Badge variant="secondary">
                      {topic.moduleCount ?? topic.modules?.length ?? 0} modules
                    </Badge>
                  </div>
                  <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-heading text-xl font-bold leading-tight">
                    {topic.title}
                  </h2>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {topic.description || "No description"}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Layers3 className="size-4" />
                  Open topic to view modules
                </div>
              </article>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
