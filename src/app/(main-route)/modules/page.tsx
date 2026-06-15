"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { modulesRegistry } from "@/config/modules";

export default function ModulesPage() {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const completed = localStorage.getItem("module_social_safety_completed") === "true";
      setIsCompleted(completed);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const totalModules = 8;
  const completedCount = isCompleted ? 1 : 0;
  const overallProgress = (completedCount / totalModules) * 100;

  return (
    <div className="flex-1 flex flex-col -m-4 pb-8 animate-fadeIn">
      {/* Top Header Section (Light Blue Background) */}
      <section className="bg-secondary/80 text-secondary-foreground p-4 relative overflow-hidden border-b border-secondary/20">
        {/* Semi-transparent decorative circles matching Figma */}
        <div className="absolute top-[-30px] right-[-20px] w-28 h-28 rounded-full bg-secondary/70 pointer-events-none" />
        <div className="absolute top-[-10px] right-[-45px] w-24 h-24 rounded-full bg-secondary/60 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="space-y-1">
            <span className="text-primary font-bold text-[10px] tracking-widest uppercase block">
              ANNUAL COMPLIANCE
            </span>
            <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
              Your Learning Path
            </h1>
          </div>

          <div className="space-y-2 max-w-[90%]">
            {/* Progress bar with white background and pink indicator */}
            <div className="relative h-2 w-full bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide block">
              {completedCount} of {totalModules} complete
            </span>
          </div>
        </div>
      </section>

      {/* Modules List Area */}
      {/* Modules List Area */}
      <section className="flex-1 p-4 space-y-4">
        {modulesRegistry.map((module) => {
          const isModuleCompleted = typeof window !== "undefined" ? localStorage.getItem(module.storageKey) === "true" : false;
          
          return (
            <div key={module.id} className="bg-primary/5 border border-primary/20 rounded-lg p-5 shadow-sm space-y-4 relative overflow-hidden transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="inline-block bg-primary text-primary-foreground px-2.5 py-0.5 text-[10px] font-bold rounded-sm uppercase tracking-wider">
                  {module.introData.badge}
                </span>
                <Link
                  href={`/modules/${module.slug}`}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group"
                >
                  {isModuleCompleted ? "Review" : "Start"}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold font-heading text-foreground leading-tight">
                  {module.introData.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  {module.introData.description}
                </p>
              </div>

              {/* Module Progress Bar */}
              <div className="space-y-1.5 pt-1.5">
                <div className="relative h-1.5 w-full bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: isModuleCompleted ? "100%" : "0%" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

