"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type {
  SubmitModuleAnswerResult,
  UserModuleDetails,
} from "@/lib/types/module.type";
import { cn, ErrorToast } from "@/lib/utils";
import { submitModuleAnswer } from "@/services/user-progress.service";
import AnimationWrapper from "@/components/ui/custom/animation-wrapper";
import { SurveyIntro } from "./SurveyIntro";
import { QuestionAnswer } from "./module-runner/QuestionAnswer";
import { QuestionPromptCard } from "./module-runner/QuestionPromptCard";
import { initialAnswer, hasAnswer } from "./module-runner/answer-utils";
import type { AnswerValue } from "./module-runner/types";

export function ModuleSurveyRunner({
  details,
}: {
  details: UserModuleDetails;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
}) {
  const router = useRouter();
  const { module, userProgress } = details;
  const startingIndex = Math.min(
    userProgress.completedQuestions,
    Math.max(module.questions.length - 1, 0),
  );
  const [isStarted, setIsStarted] = useState(
    userProgress.status === "in_progress",
  );
  const [isCompleted, setIsCompleted] = useState(
    userProgress.status === "completed",
  );
  const [currentIndex, setCurrentIndex] = useState(startingIndex);
  const [answer, setAnswer] = useState<AnswerValue | null>(() =>
    initialAnswer(module.questions[startingIndex]),
  );
  const [result, setResult] = useState<SubmitModuleAnswerResult>();
  const [finalResult, setFinalResult] = useState<SubmitModuleAnswerResult>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = module.questions[currentIndex];
  const totalQuestions = module.questions.length;
  const localProgress =
    result?.progressPercentage ?? userProgress.progressPercentage;

  const handleSubmit = async (submittedAnswer: AnswerValue | null = answer) => {
    if (!question || !hasAnswer(submittedAnswer)) return;
    setIsSubmitting(true);

    try {
      const response = await submitModuleAnswer({
        moduleId: module._id,
        questionId: question.id,
        answer: submittedAnswer as AnswerValue,
      });

      if (!response.success) throw new Error(response.message);
      const isLastQuestion = currentIndex >= totalQuestions - 1;
      const shouldForceCompletion =
        isLastQuestion &&
        !(question.type === "Ordering" && response.data.isCorrect === false);
      const nextResult = shouldForceCompletion
        ? {
            ...response.data,
            moduleStatus:
              response.data.moduleStatus === "completed"
                ? response.data.moduleStatus
                : "completed",
            progressPercentage: Math.max(
              response.data.progressPercentage ?? 0,
              100,
            ),
            completedQuestions: Math.max(
              response.data.completedQuestions ?? 0,
              totalQuestions,
            ),
          }
        : response.data;
      setResult(nextResult);
      setFinalResult(nextResult);
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to submit your answer",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryOrdering = () => {
    setResult(undefined);
  };

  const handleContinue = () => {
    if (!result) return;

    if (
      result.moduleStatus === "completed" ||
      currentIndex >= totalQuestions - 1
    ) {
      setIsCompleted(true);
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setAnswer(initialAnswer(module.questions[nextIndex]));
    setResult(undefined);
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && bottomRef.current && question?.type !== "Swipe") {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }
  }, [question?.type, result]);

  useEffect(() => {
    if (question?.type !== "Simulated Call" || !result) return;

    const timer = window.setTimeout(() => {
      if (
        result.moduleStatus === "completed" ||
        currentIndex >= totalQuestions - 1
      ) {
        setIsCompleted(true);
        return;
      }

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setAnswer(initialAnswer(module.questions[nextIndex]));
      setResult(undefined);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [currentIndex, module.questions, question?.type, result, totalQuestions]);

  if (!isStarted && !isCompleted) {
    return (
      <SurveyIntro
        title={module.title}
        description={module.description}
        badge="Learning module"
        imageUrl={module.thumbnailImage || "/window.svg"}
        questionCount={module.questions.length}
        format="Interactive"
        startLabel={userProgress.completedQuestions > 0 ? "Continue" : "Start"}
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
                You completed all {totalQuestions} questions in {module.title}.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg border border-secondary-foreground/10 bg-secondary/30 p-3 text-center">
              <div>
                <p className="text-xl font-bold text-primary">
                  {finalResult?.moduleScore ??
                    userProgress.answers?.reduce(
                      (acc, ans) => acc + (ans.score || 0),
                      0,
                    ) ??
                    0}
                </p>
                <p className="text-xs text-muted-foreground">Module score</p>
              </div>
              <div>
                <p className="text-xl font-bold text-primary">100%</p>
                <p className="text-xs text-muted-foreground">Progress</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <Button
              size="lg"
              className="w-full"
              onClick={() => router.push("/modules")}
            >
              Back to learning path <ArrowRight />
            </Button>
          </div>
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

  const displayedProgress = result
    ? result.progressPercentage
    : Math.max(
        localProgress,
        (currentIndex / Math.max(totalQuestions, 1)) * 100,
      );
  const isSimulatedCall = question.type === "Simulated Call";
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

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-1 flex-col overflow-hidden animate-fadeIn",
        isSimulatedCall ? "bg-foreground" : "bg-background",
      )}
    >
      {!isSimulatedCall && (
        <div className="mb-4 rounded-b-xl bg-secondary px-4 py-3 shadow-sm">
          <h2 className="mb-2 font-heading text-lg font-bold leading-tight text-foreground">
            {module.title}
          </h2>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-end justify-between">
              <span className="rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-primary-foreground">
                Q{currentIndex + 1}/{totalQuestions}
              </span>
              <span className="text-[10px] font-bold leading-none text-foreground/80">
                {currentIndex + 1}/{totalQuestions}
              </span>
            </div>
            <Progress
              value={displayedProgress}
              className="h-1.5 w-full rounded-full bg-background/50 [&>div]:bg-primary"
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
            "flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto scrollbar-thin",
            isSimulatedCall
              ? "overflow-hidden rounded-lg bg-foreground p-0"
              : "space-y-4 pb-2",
          )}
        >
          {question.type !== "Swipe" &&
            question.type !== "Simulated Call" &&
            question.type !== "Chat Scenario" && (
              <QuestionPromptCard question={question} />
            )}

          <QuestionAnswer
            question={question}
            answer={answer}
            disabled={Boolean(result) || isSubmitting}
            onAnswer={setAnswer}
            onSwipe={(direction) => {
              setAnswer(direction);
              void handleSubmit(direction);
            }}
            onAutoSubmit={(ans) => {
              void handleSubmit(ans);
            }}
            correctAnswer={result?.correctAnswer}
            isSubmitted={Boolean(result)}
          />

          {result && question.type !== "Simulated Call" && (
            <AnimationWrapper direction="up" duration={0.3} delay={0.1}>
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
                    <span className="font-medium text-primary">
                      Explanation:{" "}
                    </span>
                    <span>{result.explanation}</span>
                  </div>
                )}
              </div>
            </AnimationWrapper>
          )}
          <div ref={bottomRef} />
        </div>
      </AnimationWrapper>

      {!isSimulatedCall && (
        <div className="mt-auto shrink-0 pt-4">
          {result ? (
            isOrderingRetry ? (
              <Button
                size="lg"
                className="w-full"
                onClick={handleRetryOrdering}
              >
                Try again
                <ArrowRight />
              </Button>
            ) : (
              <Button size="lg" className="w-full" onClick={handleContinue}>
                {currentIndex === totalQuestions - 1 ||
                result.moduleStatus === "completed"
                  ? "View result"
                  : "Continue"}
                <ArrowRight />
              </Button>
            )
          ) : (
            <Button
              size="lg"
              className="w-full"
              disabled={!hasAnswer(answer) || isSubmitting}
              onClick={() => void handleSubmit()}
            >
              {isSubmitting ? "Loading..." : "Next"}
              {!isSubmitting && <ArrowRight />}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
