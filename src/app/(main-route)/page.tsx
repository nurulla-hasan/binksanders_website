"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { modulesRegistry } from "@/config/modules";

export default function HomePage() {
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const statuses: Record<string, boolean> = {};
      modulesRegistry.forEach(mod => {
        statuses[mod.id] = localStorage.getItem(mod.storageKey) === "true";
      });
      setCompletedModules(statuses);
      setIsClient(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isClient) return <div className="flex-1 min-h-dvh bg-background" />;

  const completedCount = Object.values(completedModules).filter(Boolean).length;
  const totalModules = modulesRegistry.length;
  const overallProgress = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;

  // Find the first module that is not completed
  const nextModuleIndex = modulesRegistry.findIndex(mod => !completedModules[mod.id]);
  const nextModule = nextModuleIndex !== -1 ? modulesRegistry[nextModuleIndex] : null;

  return (
    <>
      {/* Main Dashboard Content */}
      <div className="flex-1 space-y-6 animate-fadeIn pb-8">
        
        {/* Welcome Progress Card (Pink) */}
        <section className="bg-primary text-primary-foreground rounded-lg p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[160px] gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold font-heading tracking-tight">
              Welcome back, Willem!
            </h1>
            <p className="text-xs text-primary-foreground/85 leading-normal">
              Your growth journey is just beginning.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-5xl font-black font-heading tracking-tight">{Math.round(overallProgress)}%</span>
              <span className="text-xs font-semibold text-primary-foreground/90 uppercase tracking-wide">
                {completedCount} of {totalModules} modules completed
              </span>
            </div>
            
            {/* Custom progress bar with secondary (light blue) indicator */}
            <div className="relative h-2 w-full bg-primary-foreground/20 rounded-lg overflow-hidden">
              <div
                className="h-full bg-secondary rounded-lg transition-all duration-500 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </section>

        {/* Next Step / Quick Scan Card */}
        {nextModule ? (
          <section className="bg-secondary rounded-lg p-6 shadow-sm border border-secondary/40 flex flex-col justify-between gap-6 relative overflow-hidden">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 relative z-10 flex-1">
                <span className="inline-block bg-background text-secondary-foreground px-2.5 py-0.5 text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm">
                  {nextModule.id === "baseline" ? "Baseline" : "Your Next Step"}
                </span>
                <h2 className="text-2xl font-bold text-secondary-foreground font-heading leading-tight pr-2">
                  {nextModule.introData.title}
                </h2>
                <p className="text-xs text-secondary-foreground/80 leading-relaxed max-w-[220px]">
                  {nextModule.introData.description.substring(0, 65)}...
                </p>
              </div>
              
              {nextModule.id === "baseline" && (
                <div className="relative shrink-0 w-28 h-20 -mt-2 z-10">
                  <Image
                    src="/scan-illustration.svg"
                    alt="Scan Illustration"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              )}
            </div>

            <Button
              size="lg"
              className="w-full flex items-center justify-center gap-2 relative z-10"
              asChild
            >
              <Link href={`/modules/${nextModule.slug}`}>
                {nextModule.id === "baseline" ? "START NOW" : "CONTINUE JOURNEY"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </section>
        ) : (
          <section className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center space-y-2">
             <h2 className="text-xl font-bold text-green-700">All Caught Up!</h2>
             <p className="text-sm text-green-600/80">You have successfully completed all available modules.</p>
          </section>
        )}

        {/* Learning Path Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-heading text-foreground tracking-tight">
            Your Learning Path
          </h2>

          <div className="space-y-4">
            {modulesRegistry.map((mod, index) => {
              const isCompleted = completedModules[mod.id];
              // Unlocked if it's the next module in line, or already completed
              const isUnlocked = isCompleted || index === nextModuleIndex;
              const isLocked = !isUnlocked;

              return (
                <div 
                  key={mod.id}
                  className={`border rounded-lg p-5 shadow-sm space-y-4 relative overflow-hidden transition-all duration-300
                    ${isLocked ? "bg-muted/30 border-border/40 opacity-60 grayscale-[0.5]" : "bg-primary/5 border-primary/10"}
                  `}
                >
                  {isLocked && (
                    <div className="absolute inset-0 bg-background/20 z-10 flex items-center justify-center backdrop-blur-[1px]" />
                  )}

                  <div className="flex items-center justify-between relative z-20">
                    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-lg uppercase tracking-wider
                      ${isLocked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}
                    `}>
                      {mod.introData.badge}
                    </span>
                    {!isLocked ? (
                      <Link
                        href={`/modules/${mod.slug}`}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group"
                      >
                        {isCompleted ? "Review" : "Start"}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        Locked
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 relative z-20">
                    <h3 className={`text-base font-bold font-heading leading-tight ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                      {mod.introData.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">
                      {mod.introData.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1 relative z-20">
                    <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <span>Progress</span>
                      <span>{isCompleted ? "100%" : "0%"}</span>
                    </div>
                    <Progress value={isCompleted ? 100 : 0} className="h-1.5 transition-all duration-500 ease-out" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </>
  );
}
