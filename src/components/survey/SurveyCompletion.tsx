/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { baselineSurveyData } from "@/seed/baseline-survey";

interface SurveyCompletionProps {
  answers: Record<number, any>;
  onReturnHome: () => void;
}

export function SurveyCompletion({ answers, onReturnHome }: SurveyCompletionProps) {
  const [step, setStep] = useState<"summary" | "rating">("summary");
  const [currentThemeIdx, setCurrentThemeIdx] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number | null>>({
    "Respect & Dignity": null,
    "Workplace Safety": null,
    "Team Communication": null,
  });

  const ratingThemes = Object.keys(ratings);
  const currentTheme = ratingThemes[currentThemeIdx];
  const selectedRating = ratings[currentTheme];

  // Calculate actual swipe stats from answers
  const swipeQuestions = baselineSurveyData.filter((q) => q.type === "swipe");
  const totalSwipes = swipeQuestions.length;
  const agreedCount = swipeQuestions.filter((q) => answers[q.id] === "agree").length;

  const completedSteps = [
    {
      title: "Video",
      status: "Watched",
    },
    {
      title: "Swipe Statements",
      status: `${agreedCount}/${totalSwipes} Agreed`,
    },
    {
      title: "MCQ",
      status: "Correct",
    },
    {
      title: "Chat scenario",
      status: "Submitted",
    },
  ];

  const handleNextTheme = () => {
    if (selectedRating === null) return;
    if (currentThemeIdx < ratingThemes.length - 1) {
      setCurrentThemeIdx(currentThemeIdx + 1);
    } else {
      // Completed rating all themes, go back home/dashboard
      onReturnHome();
    }
  };

  const handleBack = () => {
    if (currentThemeIdx > 0) {
      setCurrentThemeIdx(currentThemeIdx - 1);
    } else {
      setStep("summary");
    }
  };

  if (step === "summary") {
    return (
      <div className="flex-1 flex flex-col justify-between min-h-[80vh] animate-fadeIn">
        <div className="space-y-6">
          {/* Top Header Card */}
          <div className="bg-primary/15 border-none p-6 rounded-lg text-center shadow-sm">
            <h1 className="text-2xl font-bold font-heading text-foreground">
              Well Done
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5 font-medium">
              You completed all steps in this module.
            </p>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {completedSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="bg-success/15 border border-success/35 rounded-lg p-4 flex items-center justify-between shadow-sm"
              >
                <span className="font-bold text-foreground text-[15px] font-sans">
                  {step.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-success-foreground">
                    {step.status}
                  </span>
                  <div className="w-6 h-6 bg-success rounded flex items-center justify-center text-white">
                    <Check className="w-4 h-4 stroke-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue to rating button */}
        <div className="mt-8">
          <Button 
            size="lg" 
            className="w-full uppercase animate-fadeIn"
            onClick={() => setStep("rating")}
          >
            CONTINUE
            <ArrowRight />
          </Button>
        </div>
      </div>
    );
  }

  // RATING SCREEN
  return (
    <div className="flex-1 flex flex-col justify-between min-h-[80vh] animate-fadeIn">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">
            Rate your team
          </h1>
          <p className="text-muted-foreground text-sm mt-2 font-medium leading-relaxed">
            How would you score your team on <span className="font-bold text-foreground underline decoration-secondary decoration-2 underline-offset-4">{currentTheme}</span>?
          </p>
        </div>

        {/* Score display and progress bar slider */}
        <div className="flex flex-col items-center justify-center py-4 bg-muted/30 rounded-lg border border-border p-6">
          <span className="text-6xl font-extrabold text-secondary font-sans h-16 flex items-center select-none">
            {selectedRating !== null ? selectedRating : "—"}
          </span>
          <span className="text-[10px] font-bold text-muted-foreground tracking-widest mt-2 select-none">
            OUT OF 10
          </span>

          {/* Shadcn Slider Component */}
          <div className="w-full mt-6 px-1 z-20">
            <Slider
              min={1}
              max={10}
              step={1}
              value={[selectedRating !== null ? selectedRating : 1]}
              onValueChange={(val) => {
                setRatings((prev) => ({ ...prev, [currentTheme]: val[0] }));
              }}
              className="cursor-pointer"
            />
          </div>
        </div>

        {/* 1-10 Boxes Grid */}
        <div>
          <div className="grid grid-cols-5 gap-2.5">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
              const isSelected = selectedRating === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRatings(prev => ({ ...prev, [currentTheme]: num }))}
                  className={`h-11 border text-[15px] font-semibold transition-all flex items-center justify-center rounded-sm ${
                    isSelected
                      ? "border-secondary bg-secondary/35 text-foreground font-black shadow-sm"
                      : "border-border bg-background hover:border-muted-foreground/40 text-muted-foreground"
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between items-center mt-2.5 px-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground">Needs work</span>
            <span className="text-[11px] font-semibold text-muted-foreground">Excellent</span>
          </div>
        </div>
      </div>

      {/* Buttons at Bottom */}
      <div className="space-y-3 mt-8">
        <Button 
          size="lg" 
          disabled={selectedRating === null}
          className="w-full uppercase"
          onClick={handleNextTheme}
        >
          {currentThemeIdx === ratingThemes.length - 1 ? "Finish" : "Next Theme"}
          <ArrowRight />
        </Button>
        <Button 
          variant="outline"
          size="lg" 
          className="w-full uppercase"
          onClick={handleBack}
        >
          <ArrowLeft />
          BACK
        </Button>
      </div>
    </div>
  );
}
