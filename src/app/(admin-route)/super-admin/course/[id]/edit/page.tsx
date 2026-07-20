import { ModuleEditor } from "@/components/super-admin/course/ModuleEditor";
import type { TParams } from "@/lib/types/global.type";
import { getModule } from "@/services/module.service";

export default async function EditModulePage({
  params,
}: {
  params: TParams<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getModule(id);

  if (!response.success) {
    throw new Error(response.message || "Unable to load module");
  }

  return <ModuleEditor module={response.data} />;
}
