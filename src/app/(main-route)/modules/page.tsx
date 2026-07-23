import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  getLearningModuleData,
  getLearningModuleId,
  getLearningModuleProgress,
} from "@/lib/learningPath";
import { getMyLearningPath } from "@/services/user-progress.service";

export default async function ModulesPage() {
  const response = await getMyLearningPath();

  if (!response.success) {
    throw new Error(response.message || "Unable to load your learning path");
  }

  const { overallStats, modules } = response.data;

  return (
    <div className="-m-4 flex flex-1 flex-col pb-8 animate-fadeIn">
      <section className="relative overflow-hidden border-b border-secondary/20 bg-secondary/80 p-4 text-secondary-foreground">
        <div className="pointer-events-none absolute -right-5 -top-7.5 size-28 rounded-full bg-secondary/70" />
        <div className="pointer-events-none absolute -right-11.25 -top-2.5 size-24 rounded-full bg-secondary/60" />

        <div className="relative z-10 space-y-4">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-primary">
              Annual compliance
            </span>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Your Learning Path
            </h1>
          </div>

          <div className="max-w-[90%] space-y-2">
            <Progress
              value={overallStats.overallProgressPercentage}
              className="h-2 bg-background"
            />
            <span className="block text-[11px] font-bold tracking-wide text-muted-foreground">
              {overallStats.completedModules} of {overallStats.totalModules} complete
            </span>
          </div>
        </div>
      </section>

      <section className="flex-1 space-y-4 p-4">
        {modules.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border bg-card px-6 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BookOpen />
            </div>
            <h2 className="font-heading text-lg font-bold">No modules assigned yet</h2>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Modules assigned to your team will appear here.
            </p>
          </div>
        ) : (
          modules.map((item, index) => {
            const moduleData = getLearningModuleData(item);
            const progress = getLearningModuleProgress(item);
            const moduleId = getLearningModuleId(item);
            const percentage = progress.progressPercentage;
            const isCompleted = progress.status === "completed" || percentage >= 100;

            return (
              <article
                key={moduleId || index}
                className="relative space-y-4 overflow-hidden rounded-lg border border-primary/20 bg-primary/5 p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    {isCompleted && <CheckCircle2 className="size-3" />}
                    {progress.status?.replaceAll("_", " ") || "Not started"}
                  </span>
                  <Link
                    href={`/modules/${moduleId}`}
                    className="group flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    {isCompleted ? "Review" : percentage > 0 ? "Continue" : "Start"}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <div className="space-y-1">
                  <h2 className="font-heading text-lg font-bold leading-tight text-foreground">
                    {moduleData.title || "Learning module"}
                  </h2>
                  <p className="text-xs leading-normal text-muted-foreground">
                    {moduleData.description ||
                      "Complete this module to continue your learning path."}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1.5">
                  <Progress value={percentage} className="h-1.5 bg-background" />
                  <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>
                      {progress.completedQuestions ?? item.completedQuestions ?? 0} of{" "}
                      {progress.totalQuestions ??
                        item.totalQuestions ??
                        moduleData.questions?.length ??
                        0}{" "}
                      questions
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
