import Image from "next/image";
import { BookOpen, CircleHelp, Layers3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import type { LearningModule } from "@/lib/types/module.type";
import { getCompanyModules } from "@/services/module.service";
import { getMyProfile } from "@/services/user.service";

type TeamModuleGroup = {
  teamId: string;
  teamName: string;
  modules: LearningModule[];
};

const groupModulesByTeam = (modules: LearningModule[]): TeamModuleGroup[] => {
  const groups = new Map<string, TeamModuleGroup>();

  modules.forEach((module) => {
    const teamId = module.teamId?._id || "unassigned";
    const currentGroup = groups.get(teamId);

    if (currentGroup) {
      currentGroup.modules.push(module);
      return;
    }

    groups.set(teamId, {
      teamId,
      teamName: module.teamId?.name || "Other modules",
      modules: [module],
    });
  });

  return Array.from(groups.values());
};

export default async function CompanyCourseDirectoryPage() {
  let modules: LearningModule[] = [];

  try {
    const profileResponse = await getMyProfile();
    const companyId = profileResponse.success
      ? profileResponse.data._id
      : undefined;

    if (companyId) {
      const moduleResponse = await getCompanyModules(companyId);
      if (moduleResponse.success) modules = moduleResponse.data;
    }
  } catch {
    // A safe empty state is rendered if assigned modules cannot be loaded.
  }

  const teamGroups = groupModulesByTeam(modules);

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Course Directory"
          description="Explore the learning modules assigned to each of your teams."
        />

        {teamGroups.length > 0 ? (
          <div className="space-y-8">
            {teamGroups.map((group) => (
              <section key={group.teamId} className="space-y-4">
                <div className="flex items-center justify-between gap-4 border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Layers3 className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-bold">
                        {group.teamName}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {group.modules.length}{" "}
                        {group.modules.length === 1 ? "module" : "modules"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {group.modules.map((module) => (
                    <ModuleCard key={module._id} module={module} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <Card className="border-dashed py-16">
            <CardContent className="flex flex-col items-center text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookOpen className="size-6" />
              </div>
              <h2 className="font-heading text-lg font-bold">
                No modules assigned yet
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Learning modules assigned to your company and teams will appear
                here.
              </p>
            </CardContent>
          </Card>
        )}
      </DashboardPageLayout>
    </div>
  );
}

function ModuleCard({ module }: { module: LearningModule }) {
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
        <CardTitle className="line-clamp-1 text-base font-bold">
          {module.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 min-h-10 leading-relaxed">
          {module.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-5 pt-4">
        <div className="flex items-center gap-2 border-t pt-4 text-xs font-medium text-muted-foreground">
          <CircleHelp className="size-4 text-primary" />
          {module.questions.length}{" "}
          {module.questions.length === 1 ? "question" : "questions"}
        </div>
      </CardContent>
    </Card>
  );
}
