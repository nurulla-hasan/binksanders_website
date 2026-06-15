/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SurveyQuestionCard } from "@/components/survey/SurveyQuestionCard";
import { SurveyCompletion } from "@/components/survey/SurveyCompletion";
import { socialSafetySurveyData } from "@/seed/social-safety-survey";

export default function SocialSafetyModulePage() {
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerData, setAnswerData] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = socialSafetySurveyData[currentIndex];
  const totalQuestions = socialSafetySurveyData.length;
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  const handleNext = useCallback(() => {
    if (answerData === null) return;
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswerData(null);
    } else {
      setIsCompleted(true);
    }
  }, [answerData, currentIndex, totalQuestions]);

  useEffect(() => {
    if (currentQuestion?.type === "swipe" && answerData !== null) {
      const timer = setTimeout(() => {
        handleNext();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [answerData, currentQuestion?.type, handleNext]);

  const handleBack = () => router.push("/modules");

  if (!hasStarted) {
    return (
      <div className="flex-1 flex flex-col w-full">
        {/* Image Header */}
        <div className="relative w-full h-[220px] rounded-lg overflow-hidden mb-4 z-0 bg-muted shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop"
            alt="Team meeting"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Card */}
        <div className="bg-secondary/40 p-4 relative z-10 flex-1 flex flex-col border border-secondary/50 shadow-sm rounded-lg">
          <span className="inline-block bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider w-max mb-4 shadow-sm rounded-lg">
            Safety
          </span>
          <h1 className="text-3xl font-bold font-heading text-secondary-foreground mb-3">
            Social Safety at Work
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
            <div className="w-px h-10 bg-border/80" />
            <div className="flex-1 text-center">
              <div className="text-xl font-bold text-primary">Multi</div>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Format</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-auto space-y-3 pt-4">
            <Button size="lg" className="w-full" onClick={() => setHasStarted(true)}>
              START <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="w-full" onClick={handleBack}>
              <ArrowLeft className="mr-2 w-4 h-4" /> BACK
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <SurveyCompletion
        answers={answers}
        onReturnHome={() => {
          localStorage.setItem("module_social_safety_completed", "true");
          router.push("/modules");
        }}
      />
    );
  }

  // Render Survey Questions
  return (
    <div className="flex-1 flex flex-col animate-fadeIn pb-8 overflow-x-hidden">
      {/* Top Header Information & Progress */}
      <div className="bg-secondary p-4 border border-secondary/40 rounded-lg relative overflow-hidden">
        {/* Decorative corner bubble */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-black/5 rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between mb-3">
          <span className="inline-block bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm rounded-lg">
            Q{currentIndex + 1}/{totalQuestions}
          </span>
          <span className="text-sm font-bold text-foreground/80">
            {currentQuestion.theme}
          </span>
        </div>
        <div className="relative z-10">
          <Progress value={progressPercentage} className="h-2 rounded-lg bg-white/50" />
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        <SurveyQuestionCard
          question={currentQuestion}
          answerData={answerData}
          onAnswer={(val) => {
            setAnswerData(val);
            setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
          }}
        />

        {/* Fixed Bottom Action Area for Next button */}
        {currentQuestion.type !== "swipe" && (
          <div className="fixed bottom-[80px] left-0 w-full px-4 z-40 pointer-events-none">
            <div className="max-w-[480px] mx-auto flex justify-end pointer-events-auto">
              <Button
                size="lg"
                onClick={handleNext}
                disabled={answerData === null}
                className="w-full"
              >
                {currentIndex === totalQuestions - 1 ? "Finish" : "Next"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
