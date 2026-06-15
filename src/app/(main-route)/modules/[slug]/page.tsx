/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SurveyIntro } from "@/components/survey/SurveyIntro";
import { SurveyCompletion } from "@/components/survey/SurveyCompletion";
import { SurveyQuestionCard } from "@/components/survey/SurveyQuestionCard";
import { getModuleConfig } from "@/config/modules";

export default function DynamicModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const config = getModuleConfig(resolvedParams.slug);

  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerData, setAnswerData] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Auto-advance logic for swipe questions
  const currentQuestion = config?.surveyData[currentIndex];
  const totalQuestions = config?.surveyData.length || 0;
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

  // Handle 404
  if (!config) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Module Not Found</h1>
          <p className="text-muted-foreground mb-4">The module you are looking for does not exist.</p>
          <Button onClick={() => router.push("/modules")}>Back to Modules</Button>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <SurveyIntro
        {...config.introData}
        onStart={() => setHasStarted(true)}
        onBack={() => router.push("/modules")}
      />
    );
  }

  if (isCompleted) {
    return (
      <SurveyCompletion
        answers={answers}
        onReturnHome={() => {
          localStorage.setItem(config.storageKey, "true");
          router.push("/modules");
        }}
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
