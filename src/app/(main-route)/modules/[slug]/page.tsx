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
import { useNextFilter } from "@/hooks/useNextFilter";

export default function DynamicModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const config = getModuleConfig(resolvedParams.slug);

  const { getFilter, updateFilter } = useNextFilter({ defaultMethod: "push" });

  // Use URL search param 'q' to track progress. If 'q' exists, survey has started.
  const qParam = getFilter("q");
  const isStarted = !!qParam;
  const currentIndex = isStarted ? Math.max(0, Number(qParam) - 1) : 0;

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize answers from sessionStorage to survive reloads
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
      if (config) {
        const saved = sessionStorage.getItem(`answers_${config.id}`);
        if (saved) {
          try {
            setAnswers(JSON.parse(saved));
          } catch (e) {
            console.error("Failed to parse saved answers", e);
          }
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [config]);

  // Persist answers to sessionStorage whenever they change
  useEffect(() => {
    if (config && isClient) {
      sessionStorage.setItem(`answers_${config.id}`, JSON.stringify(answers));
    }
  }, [answers, config, isClient]);

  const currentQuestion = config?.surveyData[currentIndex];
  const totalQuestions = config?.surveyData.length || 0;
  const progressPercentage = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  // Derive answerData for current question directly from answers state
  const answerData = currentQuestion ? (answers[currentQuestion.id] ?? null) : null;

  const handleNext = useCallback(() => {
    if (answerData === null) return;

    if (currentIndex < totalQuestions - 1) {
      updateFilter("q", String(currentIndex + 2));
    } else {
      setIsCompleted(true);
    }
  }, [answerData, currentIndex, totalQuestions, updateFilter]);

  // Auto-advance logic for swipe questions
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
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  // Prevent hydration mismatch for intro vs question
  if (!isClient) {
    return <div className="flex-1 bg-background" />;
  }

  if (!isStarted) {
    return (
      <SurveyIntro
        {...config.introData}
        onStart={() => updateFilter("q", "1")}
        onBack={() => router.push("/")}
      />
    );
  }

  if (isCompleted) {
    return (
      <SurveyCompletion
        answers={answers}
        onReturnHome={() => {
          localStorage.setItem(config.storageKey, "true");
          sessionStorage.removeItem(`answers_${config.id}`); // Clear temporary answers
          router.push("/");
        }}
      />
    );
  }

  if (!currentQuestion) {
    return <div className="flex-1 flex items-center justify-center">Loading question...</div>;
  }

  return (
    <div className="flex-1 flex flex-col animate-fadeIn pb-8 overflow-x-hidden">
      {/* Slim Progress Header */}
      <div className="flex items-center gap-3 pt-2 pb-4">
        <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
          Q{currentIndex + 1}/{totalQuestions}
        </span>
        <Progress value={progressPercentage} className="h-1.5 flex-1" />
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        <SurveyQuestionCard
          question={currentQuestion}
          answerData={answerData}
          onAnswer={(val) => {
            setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
          }}
        />

        {/* Bottom Action Area */}
        {currentQuestion.type !== "swipe" && (
          <div className="mt-8 mb-4 flex justify-end">
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
        )}
      </div>
    </div>
  );
}
