import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import type { TParams } from "@/lib/types/global.type";
import type { Topic } from "@/lib/types/training.type";
import { getCompanyTrainings, getTrainingTopics } from "@/services/training.service";
import { getMyProfile } from "@/services/user.service";

const getCompanyId = async () => {
  const profileResponse = await getMyProfile();
  if (!profileResponse.success) return "";

  const profile = profileResponse.data;
  return profile.role === "company" ? profile._id : profile.companyId;
};

export default async function CompanyTrainingTopicsPage({
  params,
}: {
  params: TParams<{ trainingId: string }>;
}) {
  const { trainingId } = await params;
  const companyId = await getCompanyId();
  const [trainingsResult, topicsResult] = await Promise.allSettled([
    companyId ? getCompanyTrainings(companyId) : Promise.resolve(null),
    getTrainingTopics(trainingId),
  ]);

  const trainingsResponse =
    trainingsResult.status === "fulfilled" ? trainingsResult.value : null;
  const training =
    trainingsResponse?.success
      ? trainingsResponse.data.find((item) => item._id === trainingId) || null
      : null;
  const topics: Topic[] =
    topicsResult.status === "fulfilled" && topicsResult.value.success
      ? topicsResult.value.data
      : training?.topics || [];

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title={training?.title || "Training Topics"}
          description={training?.description || "Choose a topic to view its modules."}
        >
          <Button asChild variant="outline" size="sm">
            <Link href="/company/course">
              <ArrowLeft /> Back to trainings
            </Link>
          </Button>
        </DashboardHeader>

        {training?.thumbnailImage && (
          <section className="mb-6 overflow-hidden rounded-md border bg-card shadow-sm">
            <div className="relative h-56 bg-muted">
              <Image
                src={training.thumbnailImage}
                alt={training.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </section>
        )}

        {topics.length > 0 ? (
          <div className="space-y-4">
            {topics.map((topic) => (
              <Link
                key={topic._id}
                href={`/company/course/${trainingId}/topics/${topic._id}`}
                className="group block rounded-md border bg-card p-5 shadow-sm transition-colors hover:border-primary/50"
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
            ))}
          </div>
        ) : (
          <Card className="border-dashed py-16">
            <CardContent className="flex flex-col items-center text-center">
              <BookOpen className="mb-3 size-9 text-primary" />
              <h2 className="font-heading text-lg font-bold">No topics available</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Topics will appear here when this training is configured.
              </p>
            </CardContent>
          </Card>
        )}
      </DashboardPageLayout>
    </div>
  );
}