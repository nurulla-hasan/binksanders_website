"use client";

import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const mockModules = [
  {
    id: "01",
    name: "Fire Safety & Evacuation",
    compliance: 95,
    completed: 190,
    total: 200,
  },
  {
    id: "02",
    name: "Harassment Prevention",
    compliance: 88,
    completed: 176,
    total: 200,
  },
  {
    id: "03",
    name: "Data Privacy & GDPR",
    compliance: 76,
    completed: 152,
    total: 200,
  },
  {
    id: "04",
    name: "Inclusive Leadership",
    compliance: 82,
    completed: 164,
    total: 200,
  },
  {
    id: "05",
    name: "Mental Health Awareness",
    compliance: 70,
    completed: 140,
    total: 200,
  },
];

export function AssignedModulesCompliance() {
  return (
    <div className="bg-card border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-foreground">
            Assigned Modules Compliance
          </h3>
        </div>
        <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1">
          {mockModules.length} modules
        </span>
      </div>
      <div className="p-4 space-y-4">
        {mockModules.map((mod, idx) => (
          <div key={idx} className="group p-4 border border-border/50 rounded-md bg-muted/10 hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <Badge
                  variant="secondary"
                  className="font-bold text-xs px-2 py-0.5 shrink-0"
                >
                  {mod.id}
                </Badge>
                <span className="font-medium text-foreground text-sm truncate">
                  {mod.name}
                </span>
              </div>
              <span className="font-bold text-foreground text-sm ml-2 shrink-0">
                {mod.compliance}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Progress
                value={mod.compliance}
                className={`h-2 flex-1 ${
                  mod.compliance >= 80
                    ? "[&>div]:bg-success"
                    : mod.compliance >= 50
                      ? "[&>div]:bg-amber-500"
                      : "[&>div]:bg-destructive"
                }`}
              />
              <span className="text-xs text-muted-foreground shrink-0 w-16 text-right">
                {mod.completed}/{mod.total}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
