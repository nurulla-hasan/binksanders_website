import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SurveyIntroProps {
  title: string;
  description: string;
  badge: string;
  imageUrl: string;
  questionCount: number;
  format: string;
  startLabel?: string;
  onStart: () => void;
}

export function SurveyIntro({ 
  title, 
  description, 
  badge, 
  imageUrl, 
  questionCount, 
  format, 
  startLabel = "Start",
  onStart, }: SurveyIntroProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col w-full overflow-y-auto pb-4">
      {/* Cover Image */}
      <div className="relative w-full h-55 rounded-lg overflow-hidden mb-4 z-0 bg-muted shadow-sm">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Content Card */}
      <div className="bg-secondary p-3 relative z-10 flex flex-col border border-secondary/50 shadow-sm rounded-lg">
        <span className="inline-block bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider w-max mb-4 shadow-sm rounded-lg">
          {badge}
        </span>
        <h1 className="text-2xl font-bold font-heading text-secondary-foreground mb-1 wrap-break-word">
          {title}
        </h1>
        <p className="text-sm text-secondary-foreground/80 leading-relaxed mb-8 max-w-full wrap-break-word">
          {description}
        </p>
        
        {/* Stats Box */}
        <div className="bg-background/80 p-3 flex items-center justify-between mb-8 shadow-sm rounded-lg">
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-primary">{questionCount}</div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Question</div>
          </div>
          <div className="w-px h-10 bg-border/80"></div>
          <div className="flex-1 text-center">
            <div className="text-xl font-bold text-primary">{format}</div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Format</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-auto space-y-3 pt-4">
          <Button type="button" size="lg" className="w-full" onClick={onStart}>
            {startLabel} <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
