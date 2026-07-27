import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import type { Training } from "@/lib/types/training.type";
import { getCompanyTrainings } from "@/services/training.service";
import { getMyProfile } from "@/services/user.service";

const getCompanyId = async () => {
  const profileResponse = await getMyProfile();
  if (!profileResponse.success) return "";

  const profile = profileResponse.data;
  return profile.role === "company" ? profile._id : profile.companyId;
};

export default async function CompanyCourseDirectoryPage() {
  let trainings: Training[] = [];

  try {
    const companyId = await getCompanyId();
    if (companyId) {
      const response = await getCompanyTrainings(companyId);
      if (response.success) trainings = response.data;
    }
  } catch {
    // A safe empty state is rendered if assigned trainings cannot be loaded.
  }

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Training Directory"
          description="Explore trainings assigned to your company and teams."
        />

        {trainings.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {trainings.map((training) => (
              <TrainingCard key={training._id} training={training} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed py-16">
            <CardContent className="flex flex-col items-center text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookOpen className="size-6" />
              </div>
              <h2 className="font-heading text-lg font-bold">
                No trainings assigned yet
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Trainings assigned to your company and teams will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </DashboardPageLayout>
    </div>
  );
}

function TrainingCard({ training }: { training: Training }) {
  return (
    <Link href={`/company/course/${training._id}`} className="group block">
      <Card className="gap-0 py-0 transition-transform hover:-translate-y-0.5">
        <div className="relative aspect-16/8 overflow-hidden bg-muted">
          {training.thumbnailImage ? (
            <Image
              src={training.thumbnailImage}
              alt={training.title}
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
            <Badge variant={training.status === "published" ? "active" : "outline"}>
              {training.status}
            </Badge>
            <Badge variant="secondary">
              {training.topicCount ?? training.topics?.length ?? 0} topics
            </Badge>
          </div>
          <CardTitle className="line-clamp-1 text-base font-bold">
            {training.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 min-h-10 leading-relaxed">
            {training.description || "Training overview"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-5 pt-4">
          <div className="flex items-center justify-between gap-3 border-t pt-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-2">
              <Layers3 className="size-4 text-primary" />
              {training.totalModules ?? 0} modules
            </span>
            <span className="flex items-center gap-1 font-bold text-primary">
              View topics
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}