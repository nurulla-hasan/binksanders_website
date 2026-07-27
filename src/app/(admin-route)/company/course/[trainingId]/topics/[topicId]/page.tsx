import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, CircleHelp, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import type { TParams } from "@/lib/types/global.type";
import type { TrainingModuleSummary } from "@/lib/types/training.type";
import { getTrainingTopic } from "@/services/training.service";

export default async function CompanyTopicModulesPage({
  params,
}: {
  params: TParams<{ trainingId: string; topicId: string }>;
}) {
  const { trainingId, topicId } = await params;
  const response = await getTrainingTopic(trainingId, topicId).catch((error: unknown) => ({
    success: false,
    message: error instanceof Error ? error.message : "Unable to load this topic.",
    data: null,
  }));

  const topic = response.success ? response.data : null;
  const modules = topic?.modules || [];

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title={topic?.title || "Topic Modules"}
          description={topic?.description || "Modules inside this topic."}
        >
          <Button asChild variant="outline" size="sm">
            <Link href={`/company/course/${trainingId}`}>
              <ArrowLeft /> Back to topics
            </Link>
          </Button>
        </DashboardHeader>

        {modules.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => (
              <ModuleCard key={module._id} module={module} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed py-16">
            <CardContent className="flex flex-col items-center text-center">
              <Layers3 className="mb-3 size-9 text-primary" />
              <h2 className="font-heading text-lg font-bold">No modules available</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Modules will appear here when this topic is configured.
              </p>
            </CardContent>
          </Card>
        )}
      </DashboardPageLayout>
    </div>
  );
}

function ModuleCard({ module }: { module: TrainingModuleSummary }) {
  return (
    <Card className="gap-0 py-0 transition-transform hover:-translate-y-0.5">
      <div className="relative aspect-16/8 overflow-hidden bg-muted">
        {module.thumbnailImage ? (
          <Image
            src={module.thumbnailImage}
            alt={module.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <BookOpen className="size-8" />
          </div>
        )}
      </div>

      <CardHeader className="pt-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant={module.status === "published" ? "active" : "outline"}>
            {module.status}
          </Badge>
        </div>
        <CardTitle className="line-clamp-1 text-base font-bold">
          {module.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 min-h-10 leading-relaxed">
          {module.description || "Learning module"}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-5 pt-4">
        <div className="flex items-center gap-2 border-t pt-4 text-xs font-medium text-muted-foreground">
          <CircleHelp className="size-4 text-primary" />
          {module.totalQuestions ?? module.questions?.length ?? 0} questions
        </div>
      </CardContent>
    </Card>
  );
}