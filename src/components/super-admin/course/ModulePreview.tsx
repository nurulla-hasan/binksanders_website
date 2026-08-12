/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useWatch } from "react-hook-form";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { CreateModuleFormValues } from "@/lib/validations/course";
import { SurveyIntro } from "@/components/survey/SurveyIntro";
import AnimationWrapper from "@/components/ui/custom/animation-wrapper";
import { QuestionAnswer } from "@/components/survey/module-runner/QuestionAnswer";
import { QuestionPromptCard } from "@/components/survey/module-runner/QuestionPromptCard";
import {
  initialAnswer,
  hasAnswer,
} from "@/components/survey/module-runner/answer-utils";

type AnswerValue = string | number | string[];

export function ModulePreview({
  existingThumbnail,
}: {
  existingThumbnail?: string;
}) {
  const title = useWatch<CreateModuleFormValues, "title">({ name: "title" });
  const description = useWatch<CreateModuleFormValues, "description">({
    name: "description",
  });
  const questions = useWatch<CreateModuleFormValues, "questions">({
    name: "questions",
  });
  const thumbnail = useWatch<CreateModuleFormValues, "thumbnail">({
    name: "thumbnail",
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState<AnswerValue | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<{
    isCorrect?: boolean;
    explanation?: string;
    correctAnswer?: AnswerValue;
  } | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    const timeout = setTimeout(() => {
      if (thumbnail && thumbnail instanceof File) {
        objectUrl = URL.createObjectURL(thumbnail);
        setPreviewUrl(objectUrl);
      } else if (existingThumbnail) {
        setPreviewUrl(existingThumbnail);
      } else {
        setPreviewUrl(null);
      }
    }, 0);

    return () => {
      clearTimeout(timeout);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [thumbnail, existingThumbnail]);

  const safeQuestions = useMemo(() => questions || [], [questions]);
  const totalQuestions = safeQuestions.length;
  const question = safeQuestions[currentIndex];

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentIndex >= totalQuestions && totalQuestions > 0) {
        setCurrentIndex(Math.max(0, totalQuestions - 1));
      }
      if (totalQuestions === 0) {
        setIsStarted(false);
        setIsCompleted(false);
        setCurrentIndex(0);
        setResult(null);
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [totalQuestions, currentIndex]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (question && answer === null && !result) {
        setAnswer(initialAnswer(question as any));
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [question, answer, result]);

  useEffect(() => {
    if (
      question?.type !== "Simulated Call" ||
      !result
    )
      return;

    const timer = window.setTimeout(() => {
      if (currentIndex >= totalQuestions - 1) {
        setIsCompleted(true);
        return;
      }
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setAnswer(initialAnswer(safeQuestions[nextIndex] as any));
      setResult(null);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [question?.type, result, currentIndex, totalQuestions, safeQuestions]);

  useEffect(() => {
    if (!result || !bottomRef.current) return;

    const timer = window.setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: question?.type === "Swipe" ? "end" : "nearest",
      });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [question?.type, result]);

  const handleSubmit = (submittedAnswer: AnswerValue | null = answer) => {
    if (!question || !hasAnswer(submittedAnswer)) return;

    let isCorrect = true;
    let correctAnswer: AnswerValue | undefined = undefined;

    if (question.type === "MCQ") {
      isCorrect = submittedAnswer === question.correctAnswer;
      correctAnswer = question.correctAnswer;
    } else if (question.type === "Ordering") {
      const correctOrder = question.items || [];
      isCorrect = JSON.stringify(submittedAnswer) === JSON.stringify(correctOrder);
      correctAnswer = correctOrder;
    } else if (question.type === "Chat Scenario") {
      isCorrect = submittedAnswer === question.correctAnswer;
      correctAnswer = question.correctAnswer;
    } else if (question.type === "Video" && question.correctAnswer) {
      isCorrect = submittedAnswer === question.correctAnswer;
      correctAnswer = question.correctAnswer;
    }

    setResult({
      isCorrect:
        question.type === "Free Input" ||
        question.type === "Swipe" ||
        question.type === "Rating" ||
        question.type === "Simulated Call" ||
        (question.type === "Video" && !question.correctAnswer)
          ? undefined
          : isCorrect,
      correctAnswer,
      explanation: question.explanation,
    });
  };

  const handleRetryOrdering = () => {
    setResult(null);
  };

  const handleContinue = () => {
    if (currentIndex >= totalQuestions - 1) {
      setIsCompleted(true);
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setAnswer(initialAnswer(safeQuestions[nextIndex] as any));
    setResult(null);
  };

  const renderContent = () => {
    if (!isStarted && !isCompleted) {
      return (
        <SurveyIntro
          title={title || "Course Title"}
          description={description || "Course description will appear here..."}
          badge="Learning module"
          imageUrl={previewUrl || "/window.svg"}
          questionCount={totalQuestions}
          format="Interactive"
          startLabel="Start"
          onStart={() => setIsStarted(true)}
        />
      );
    }

    if (isCompleted) {
      return (
        <AnimationWrapper
          direction="up"
          duration={0.4}
          className="flex h-full flex-col"
        >
          <div className="flex h-full flex-1 flex-col justify-between">
          <div className="space-y-4">
            <div className="rounded-lg bg-primary p-3 text-center text-primary-foreground shadow-sm">
              <CheckCircle2 className="mx-auto mb-2.5 size-10" />
              <h1 className="font-heading text-xl font-bold">
                Module completed
              </h1>
              <p className="mt-1.5 text-xs text-primary-foreground/85">
                You completed all {totalQuestions} questions in {title}.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg border border-secondary-foreground/10 bg-secondary/30 p-3 text-center">
              <div>
                <p className="text-xl font-bold text-primary">100</p>
                <p className="text-xs text-muted-foreground">Module score</p>
              </div>
              <div>
                <p className="text-xl font-bold text-primary">100%</p>
                <p className="text-xs text-muted-foreground">Progress</p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            size="lg"
            className="mt-auto w-full"
            onClick={() => {
              setIsStarted(false);
              setIsCompleted(false);
              setCurrentIndex(0);
              setResult(null);
            }}
          >
            Restart Preview
          </Button>
          </div>
        </AnimationWrapper>
      );
    }

    if (!question) {
      return (
        <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
          No questions are available in this module.
        </div>
      );
    }

    const displayedProgress =
      totalQuestions > 0
        ? ((result ? currentIndex + 1 : currentIndex) / totalQuestions) * 100
        : 0;
    const canShowCorrectAnswer = ![
      "Information",
      "Rating",
      "Free Input",
      "Simulated Call",
    ].includes(question.type);
    const isOptionFeedback =
      ["MCQ", "Chat Scenario", "Video"].includes(question.type) &&
      Boolean(result);
    const hasFeedbackCorrectAnswer =
      result?.correctAnswer !== undefined &&
      result?.correctAnswer !== null &&
      !(
        typeof result.correctAnswer === "string" &&
        result.correctAnswer.trim() === ""
      );
    const isOrderingRetry =
      question.type === "Ordering" && result?.isCorrect === false;
    const feedbackTitle = canShowCorrectAnswer
      ? result?.isCorrect === false
        ? "Not quite right"
        : result?.isCorrect === true
          ? "Correct answer"
          : "Answer submitted"
      : question.type === "Information" && answer === "reviewed"
        ? "Reviewed"
        : "Answer submitted";

    const isSimulatedCall = question?.type === "Simulated Call";
    const questionBackgroundColor = /^#[0-9A-Fa-f]{6}$/.test(
      question.colorCode || "",
    )
      ? question.colorCode
      : undefined;

    return (
      <div
        className={cn(
          "flex h-full min-h-0 w-full flex-col overflow-hidden bg-secondary p-3 text-foreground animate-fadeIn sm:p-5",
        )}
        style={{ backgroundColor: questionBackgroundColor }}
      >
        {!isSimulatedCall && (
          <div className="mb-4 shrink-0 px-1 py-2">
            <h2 className="mb-2 font-heading text-lg font-bold leading-tight text-secondary-foreground">
              {title || "Course Title"}
            </h2>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-end justify-between">
                <span className="rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-primary-foreground">
                  Q{currentIndex + 1}/{totalQuestions}
                </span>
                <span className="text-[10px] font-bold leading-none text-secondary-foreground/80">
                  {currentIndex + 1}/{totalQuestions}
                </span>
              </div>
              <Progress
                value={displayedProgress}
                className="h-1.5 w-full rounded-full bg-secondary-foreground/25 [&>div]:bg-secondary-foreground"
              />
            </div>
          </div>
        )}

        <AnimationWrapper
          key={currentIndex}
          direction="left"
          duration={0.4}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div
            className={cn(
              "flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden",
              isSimulatedCall
                ? "overflow-hidden rounded-lg bg-foreground p-0"
                : "space-y-4 pb-2",
            )}
          >
            {question.type !== "Swipe" &&
            question.type !== "Simulated Call" &&
            question.type !== "Chat Scenario" && (
              <QuestionPromptCard question={question as any} />
            )}

            <QuestionAnswer
            question={question as any}
            answer={answer}
            disabled={Boolean(result)}
            onAnswer={setAnswer}
            onSwipe={(direction) => {
              setAnswer(direction);
              handleSubmit(direction);
            }}
            onAutoSubmit={(ans) => {
              handleSubmit(ans);
            }}
            correctAnswer={result?.correctAnswer}
            isSubmitted={Boolean(result)}
          />

            {result && question.type !== "Simulated Call" && (
            <div className="space-y-3">
              {isOptionFeedback ? (
                <div
                  className={cn(
                    "min-w-0 rounded-sm border bg-background p-3 text-sm font-medium wrap-break-word",
                    result.isCorrect === false
                      ? "border-primary text-primary"
                      : result.isCorrect === true
                        ? "border-success text-success"
                        : "border-border text-foreground",
                  )}
                >
                  {result.isCorrect === false
                    ? hasFeedbackCorrectAnswer
                      ? "Incorrect - correct answer is highlighted."
                      : "Incorrect."
                    : result.isCorrect === true
                      ? hasFeedbackCorrectAnswer
                        ? "Correct - answer is highlighted."
                        : "Correct."
                      : "Answer submitted."}
                </div>
              ) : (
                <div
                  className={cn(
                    "min-w-0 overflow-hidden rounded-sm border p-3 text-sm wrap-break-word",
                    result.isCorrect === false
                      ? "border-destructive/30 bg-destructive/10 text-destructive-foreground"
                      : result.isCorrect === true
                        ? "border-2 border-success bg-background text-foreground"
                        : "border-2 border-border bg-background text-foreground",
                  )}
                >
                  <p className="font-medium">{feedbackTitle}</p>
                  {isOrderingRetry && (
                    <p className="mt-2 wrap-break-word font-medium">
                      Rearrange the items and try again.
                    </p>
                  )}
                  {canShowCorrectAnswer &&
                    !isOrderingRetry &&
                    result.isCorrect === false &&
                    result.correctAnswer && (
                      <p className="mt-2 wrap-break-word font-medium">
                        Correct answer:{" "}
                        {Array.isArray(result.correctAnswer)
                          ? result.correctAnswer.join(" -> ")
                          : result.correctAnswer}
                      </p>
                    )}
                </div>
              )}
              {result.explanation && !isOrderingRetry && (
                <div className="min-w-0 rounded-sm border border-border bg-background p-3 text-sm wrap-break-word">
                  <span className="font-bold text-primary">Explanation: </span>
                  <span>{result.explanation}</span>
                </div>
              )}
            </div>
          )}
            <div ref={bottomRef} />
          </div>
        </AnimationWrapper>

        {!isSimulatedCall && (
          <div className="mt-auto shrink-0 pt-4 [&_button]:bg-background [&_button]:text-foreground [&_button]:hover:bg-background/90">
            {result ? (
              isOrderingRetry ? (
                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  onClick={handleRetryOrdering}
                >
                  Try again
                  <ArrowRight />
                  </Button>
              ) : (
                <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={handleContinue}
              >
                {currentIndex === totalQuestions - 1
                  ? "View result"
                  : "Continue"}
                <ArrowRight />
                </Button>
              )
            ) : (
              <Button
                type="button"
                size="lg"
                className="w-full"
                disabled={!hasAnswer(answer)}
                onClick={() => handleSubmit()}
              >
                Next
                <ArrowRight />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold">Interactive Preview</h3>
        <span className="text-xs text-muted-foreground">
          Learner&apos;s View
        </span>
      </div>

      <div className="relative flex h-[80dvh] max-h-190 min-h-130 flex-col overflow-hidden rounded-lg border bg-card shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
}
