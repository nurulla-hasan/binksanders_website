"use client";

import { useEffect, useState } from "react";
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
import { initialAnswer, hasAnswer } from "./module-runner/answer-utils";
import { MediaImage } from "./module-runner/media";
import type { AnswerValue, MediaValue } from "./module-runner/types";

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
  const localProgress = result?.progressPercentage ?? userProgress.progressPercentage;

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
      const nextResult = isLastQuestion
        ? {
            ...response.data,
            moduleStatus: response.data.moduleStatus === "completed" ? response.data.moduleStatus : "completed",
            progressPercentage: Math.max(response.data.progressPercentage ?? 0, 100),
            completedQuestions: Math.max(response.data.completedQuestions ?? 0, totalQuestions),
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

  useEffect(() => {
    if (question?.type !== "Swipe" || !result) return;

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
      <AnimationWrapper direction="up" duration={0.4}>
        <div className="flex min-h-[50dvh] flex-1 flex-col justify-between">
          <div className="space-y-4">
            <div className="rounded-lg bg-primary p-4 text-center text-primary-foreground shadow-sm">
              <CheckCircle2 className="mx-auto mb-2.5 size-10" />
              <h1 className="font-heading text-xl font-bold">Module completed</h1>
              <p className="mt-1.5 text-xs text-primary-foreground/85">
                You completed all {totalQuestions} questions in {module.title}.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg border bg-card p-3 text-center">
              <div>
                <p className="text-xl font-bold text-primary">
                  {finalResult?.moduleScore ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Module score</p>
              </div>
              <div>
                <p className="text-xl font-bold text-primary">100%</p>
                <p className="text-xs text-muted-foreground">Progress</p>
              </div>
            </div>
          </div>

          <Button size="lg" onClick={() => router.push("/modules")}>
            Back to learning path <ArrowRight />
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

  const displayedProgress = result
    ? result.progressPercentage
    : Math.max(localProgress, (currentIndex / Math.max(totalQuestions, 1)) * 100);
  const isSimulatedCall = question.type === "Simulated Call";
  const canShowCorrectAnswer = !["Information", "Rating", "Free Input", "Simulated Call"].includes(question.type);
  const isOptionFeedback = ["MCQ", "Chat Scenario", "Video"].includes(question.type) && Boolean(result);
  const hasFeedbackCorrectAnswer = result?.correctAnswer !== undefined && result?.correctAnswer !== null && !(typeof result.correctAnswer === "string" && result.correctAnswer.trim() === "");
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
    <div className="flex flex-1 min-h-0 h-full flex-col overflow-hidden rounded-lg border border-secondary/50 bg-secondary p-3 shadow-sm animate-fadeIn">
      <div className="flex shrink-0 items-center gap-3 pb-2.5 pt-1">
        <span className="whitespace-nowrap text-xs font-bold text-secondary-foreground/80">
          Q{currentIndex + 1}/{totalQuestions}
        </span>
        <Progress value={displayedProgress} className="h-1.5 flex-1" />
      </div>

      <AnimationWrapper key={currentIndex} direction="left" duration={0.4} className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div
          className={cn(
            "flex-1 min-h-0 overflow-y-auto scrollbar-thin flex flex-col",
            isSimulatedCall
              ? "overflow-hidden rounded-lg bg-foreground p-0"
              : "space-y-4 rounded-lg bg-background/45 p-3 pr-1.5",
          )}
        >
          {question.type !== "Swipe" && question.type !== "Simulated Call" && question.type !== "Chat Scenario" && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {question.type}
              </span>
              <h1 className="mt-2 font-heading text-xl font-bold leading-snug wrap-break-word">
                {question.content}
              </h1>
              {question.image && (
                <MediaImage value={question.image as MediaValue} alt="" className="mt-4 max-h-48 w-full rounded-lg border bg-background object-contain" />
              )}
            </div>
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
            correctAnswer={result?.correctAnswer}
            isSubmitted={Boolean(result)}
          />

          {result && (
            <AnimationWrapper direction="up" duration={0.3} delay={0.1}>
              <div className="space-y-3">
                {isOptionFeedback ? (
                  <div
                    className={cn(
                      "min-w-0 rounded-sm border bg-background p-4 text-sm font-semibold wrap-break-word",
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
                      "min-w-0 overflow-hidden rounded-sm border p-4 text-sm wrap-break-word",
                      result.isCorrect === false
                        ? "border-destructive/30 bg-destructive/10 text-destructive-foreground"
                        : result.isCorrect === true
                          ? "border-2 border-success bg-background text-foreground"
                          : "border-2 border-border bg-background text-foreground",
                    )}
                  >
                    <p className="font-bold">{feedbackTitle}</p>
                    {canShowCorrectAnswer && result.isCorrect === false && result.correctAnswer && (
                      <p className="mt-2 wrap-break-word font-medium">
                        Correct answer:{" "}
                        {Array.isArray(result.correctAnswer)
                          ? result.correctAnswer.join(" -> ")
                          : result.correctAnswer}
                      </p>
                    )}
                  </div>
                )}
                {result.explanation && (
                  <div className="min-w-0 rounded-sm border border-border bg-background p-4 text-sm wrap-break-word">
                    <span className="font-bold text-primary">Explanation: </span>
                    <span>{result.explanation}</span>
                  </div>
                )}
              </div>
            </AnimationWrapper>
          )}
        </div>
      </AnimationWrapper>

      <div className="shrink-0 pt-3 mt-auto border-t border-secondary-foreground/10 bg-secondary">
        {result && question.type === "Swipe" ? (
          <div className="py-2 text-center text-sm font-medium text-muted-foreground">
            Loading next question...
          </div>
        ) : result ? (
          <Button size="lg" className="w-full" onClick={handleContinue}>
            {currentIndex === totalQuestions - 1 || result.moduleStatus === "completed"
              ? "View result"
              : "Continue"}
            <ArrowRight />
          </Button>
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
    </div>
  );
}






