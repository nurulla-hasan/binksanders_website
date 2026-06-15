import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SurveyIntroProps {
  onStart: () => void;
  onBack: () => void;
}

export function SurveyIntro({ onStart, onBack }: SurveyIntroProps) {
  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Cover Image */}
      <div className="relative w-full h-[220px] rounded-lg overflow-hidden mb-4 z-0 bg-muted shadow-sm">
        <Image 
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop" 
          alt="Team Meeting" 
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Content Card */}
      <div className="bg-secondary p-4 relative z-10 flex-1 flex flex-col border border-secondary/50 shadow-sm rounded-lg">
        <span className="inline-block bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider w-max mb-4 shadow-sm rounded-lg">
          Baseline
        </span>
        <h1 className="text-3xl font-bold font-heading text-secondary-foreground mb-3">
          Quick Scan
        </h1>
        <p className="text-sm text-secondary-foreground/80 leading-relaxed mb-8 max-w-[90%]">
          Map your team&apos;s current safety culture across 3 themes. Swipe through statements, then rate each theme 1–10.
        </p>
        
        {/* Stats Box */}
        <div className="bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between mb-8 shadow-sm rounded-lg">
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-primary">30</div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Question</div>
          </div>
          <div className="w-px h-10 bg-border/80"></div>
          <div className="flex-1 text-center">
            <div className="text-xl font-bold text-primary">Multi</div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Format</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-auto space-y-3 pt-4">
          <Button size="lg" className="w-full" onClick={onStart}>
            Start <ArrowRight />
          </Button>
          <Button size="lg" variant="outline" className="w-full" onClick={onBack}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
