import { ModuleSurveyRunner } from "@/components/survey/ModuleSurveyRunner";
import type { TParams } from "@/lib/types/global.type";
import { getUserModule } from "@/services/user-progress.service";

export default async function UserModulePage({
  params,
}: {
  params: TParams<{ slug: string }>;
}) {
  const { slug: moduleId } = await params;
  const response = await getUserModule(moduleId);

  if (!response.success) {
    throw new Error(response.message || "Unable to load this module");
  }

  return <ModuleSurveyRunner details={response.data} />;
}
