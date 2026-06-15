import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function HomePage() {
  return (
    <>
      {/* Main Dashboard Content */}
      <div className="flex-1 space-y-6 animate-fadeIn">
        
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
              <span className="text-5xl font-black font-heading tracking-tight">0%</span>
              <span className="text-xs font-semibold text-primary-foreground/90 uppercase tracking-wide">
                0 of 5 modules completed
              </span>
            </div>
            
            {/* Custom progress bar with secondary (light blue) indicator */}
            <div className="relative h-2 w-full bg-primary-foreground/20 rounded-lg overflow-hidden">
              <div
                className="h-full bg-secondary rounded-lg transition-all duration-500"
                style={{ width: "0%" }}
              />
            </div>
          </div>
        </section>

        {/* Quick Scan Card (Light Blue) */}
        <section className="bg-secondary rounded-lg p-6 shadow-sm border border-secondary/40 flex flex-col justify-between gap-6 relative overflow-hidden">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2">
              <span className="inline-block bg-background text-secondary-foreground px-2.5 py-0.5 text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm">
                Baseline
              </span>
              <h2 className="text-2xl font-bold text-secondary-foreground font-heading leading-tight">
                Quick Scan
              </h2>
              <p className="text-xs text-secondary-foreground/80 leading-relaxed max-w-[200px]">
                Find out where you stand. Takes about 5 minutes.
              </p>
            </div>
            
            <div className="relative shrink-0 w-28 h-20 -mt-2">
              <Image
                src="/scan-illustration.svg"
                alt="Scan Illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <Button
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            asChild
          >
            <Link href="/survey/baseline">
              START NOW
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </section>

        {/* Learning Path Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-heading text-foreground tracking-tight">
            Your Learning Path
          </h2>

          {/* Course Card (Light Pink) */}
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-block bg-primary/10 text-primary px-2.5 py-0.5 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                Safety
              </span>
              <Link
                href="/modules"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group"
              >
                Start
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold font-heading text-foreground leading-tight">
                Social Safety at Work
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Multiple choice with immediate feedback.
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <span>Progress</span>
                <span>0%</span>
              </div>
              <Progress value={0} className="h-1.5" />
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
