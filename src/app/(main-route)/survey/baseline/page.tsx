/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SurveyIntro } from "@/components/survey/SurveyIntro";
import { SurveyCompletion } from "@/components/survey/SurveyCompletion";
import { SurveyQuestionCard } from "@/components/survey/SurveyQuestionCard";
import { baselineSurveyData } from "@/seed/baseline-survey";

export default function BaselineSurveyPage() {
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerData, setAnswerData] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = baselineSurveyData[currentIndex];
  const totalQuestions = baselineSurveyData.length;
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  const handleNext = useCallback(() => {
    // Basic validation depending on type, but for now we just require some non-null answerData (or allow it if optional)
    // Actually, we disable the Next button if answerData is null.
    if (answerData === null) return;

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswerData(null); // Reset selection for next question
    } else {
      // Survey completed
      setIsCompleted(true);
    }
  }, [answerData, currentIndex, totalQuestions]);

  // Auto-advance logic for swipe questions
  useEffect(() => {
    if (currentQuestion?.type === "swipe" && answerData !== null) {
      const timer = setTimeout(() => {
        handleNext();
      }, 300); // 300ms delay for card swipe animation
      return () => clearTimeout(timer);
    }
  }, [answerData, currentQuestion?.type, handleNext]);

  if (!hasStarted) {
    return (
      <SurveyIntro
        onStart={() => setHasStarted(true)}
        onBack={() => router.back()}
      />
    );
  }

  if (isCompleted) {
    return (
      <SurveyCompletion
        answers={answers}
        onReturnHome={() => router.push("/")}
      />
    );
  }

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

        {/* Fixed Bottom Action Area */}
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
