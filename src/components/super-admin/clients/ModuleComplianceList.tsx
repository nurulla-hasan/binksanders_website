import { BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { CompanyAnalytics } from "@/lib/types/company.type";

export function ModuleComplianceList({
  modules,
}: {
  modules: CompanyAnalytics["moduleCompliance"];
}) {
  return (
    <section className="overflow-hidden rounded-md border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-primary" />
          <h2 className="font-bold">Assigned Modules Compliance</h2>
        </div>
        <span className="text-xs text-muted-foreground">
          {modules.length} modules
        </span>
      </div>
      <div className="space-y-3 p-4">
        {modules.map((module, index) => (
          <div key={module.moduleId} className="rounded-md border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                <span className="rounded bg-secondary px-2 py-0.5 text-xs font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {module.moduleName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {module.teamName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">
                  {module.completionPercentage}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {module.completedCount}/{module.totalAssigned}
                </p>
              </div>
            </div>
            <Progress
              value={module.completionPercentage}
              className="mt-3 h-2"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
