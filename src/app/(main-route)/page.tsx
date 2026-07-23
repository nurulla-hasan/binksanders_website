import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  getLearningModuleData,
  getLearningModuleId,
  getLearningModuleProgress,
} from "@/lib/learningPath";
import { getMyLearningPath } from "@/services/user-progress.service";

export default async function HomePage() {
  const response = await getMyLearningPath();

  if (!response.success) {
    throw new Error(response.message || "Unable to load your dashboard");
  }

  const { user, overallStats, modules } = response.data;
  const moduleItems = modules.map((item) => ({
    item,
    details: getLearningModuleData(item),
    id: getLearningModuleId(item),
    progress: getLearningModuleProgress(item),
  }));
  const nextModule =
    moduleItems.find(
      ({ progress }) =>
        progress.status !== "completed" && progress.progressPercentage < 100,
    ) ?? null;

  return (
    <div className="flex-1 space-y-6 pb-8 animate-fadeIn">
      <section className="relative flex min-h-40 flex-col justify-between gap-6 overflow-hidden rounded-lg bg-primary p-6 text-primary-foreground shadow-sm">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Welcome back, {user.firstName || "Learner"}!
          </h1>
          <p className="text-xs leading-normal text-primary-foreground/85">
            Keep moving forward on your learning journey.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-heading text-5xl font-black tracking-tight">
              {Math.round(overallStats.overallProgressPercentage)}%
            </span>
            <span className="text-right text-xs font-semibold uppercase tracking-wide text-primary-foreground/90">
              {overallStats.completedModules} of {overallStats.totalModules} modules
              completed
            </span>
          </div>
          <Progress
            value={overallStats.overallProgressPercentage}
            className="h-2 bg-primary-foreground/20"
          />
        </div>
      </section>

      {nextModule ? (
        <section className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-lg border border-secondary/40 bg-secondary p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="relative z-10 flex-1 space-y-2">
              <span className="inline-block rounded-lg bg-background px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground shadow-sm">
                {nextModule.progress.progressPercentage > 0
                  ? "Continue learning"
                  : "Your next step"}
              </span>
              <h2 className="pr-2 font-heading text-2xl font-bold leading-tight text-secondary-foreground">
                {nextModule.details.title}
              </h2>
              <p className="max-w-64 text-xs leading-relaxed text-secondary-foreground/80">
                {nextModule.details.description}
              </p>
            </div>

            {nextModule.details.thumbnailImage && (
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md">
                <Image
                  src={nextModule.details.thumbnailImage}
                  alt={nextModule.details.title}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Progress
              value={nextModule.progress.progressPercentage}
              className="h-1.5 bg-background/70"
            />
            <Button size="lg" className="w-full" asChild>
              <Link href={`/modules/${nextModule.id}`}>
                {nextModule.progress.progressPercentage > 0
                  ? "Continue journey"
                  : "Start now"}
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      ) : moduleItems.length > 0 ? (
        <section className="space-y-2 rounded-lg bg-success p-6 text-center shadow-sm">
          <CheckCircle2 className="mx-auto size-9 text-success-foreground" />
          <h2 className="text-xl font-bold text-success-foreground">
            All caught up!
          </h2>
          <p className="text-sm font-medium text-success-foreground/90">
            You have completed all available modules.
          </p>
        </section>
      ) : (
        <section className="flex min-h-52 flex-col items-center justify-center rounded-lg border bg-card p-6 text-center shadow-sm">
          <BookOpen className="mb-3 size-9 text-primary" />
          <h2 className="font-heading text-lg font-bold">No modules assigned yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Modules assigned to your team will appear here.
          </p>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">
            Your Learning Path
          </h2>
          {moduleItems.length > 0 && (
            <span className="text-xs font-medium text-muted-foreground">
              Average score {Math.round(overallStats.averageScore)}%
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5">
          {moduleItems.map(({ details, id, progress }) => {
            const isCompleted =
              progress.status === "completed" ||
              progress.progressPercentage >= 100;

            return (
              <article
                key={id}
                className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors hover:border-primary/50"
              >
                {details.thumbnailImage && (
                  <div className="relative h-36 w-full border-b border-border/50 bg-muted">
                    <Image
                      src={details.thumbnailImage}
                      alt={details.title}
                      fill
                      sizes="(max-width: 480px) 100vw, 480px"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-col justify-between space-y-5 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {isCompleted && <CheckCircle2 className="size-3" />}
                      {progress.status.replaceAll("_", " ")}
                    </span>
                    <Link
                      href={`/modules/${id}`}
                      className="group flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      {isCompleted
                        ? "Review"
                        : progress.progressPercentage > 0
                          ? "Continue"
                          : "Start"}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-heading text-base font-bold leading-tight text-foreground">
                      {details.title}
                    </h3>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {details.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span>
                        {progress.completedQuestions} of{" "}
                        {progress.totalQuestions ?? details.questions?.length ?? 0}{" "}
                        questions
                      </span>
                      <span>{Math.round(progress.progressPercentage)}%</span>
                    </div>
                    <Progress
                      value={progress.progressPercentage}
                      className="h-1.5"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
