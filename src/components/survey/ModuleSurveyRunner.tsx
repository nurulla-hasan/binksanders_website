"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  MessageCircle,
  Phone,
  Play,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import type {
  ModuleQuestion,
  SubmitModuleAnswerResult,
  UserModuleDetails,
} from "@/lib/types/module.type";
import { cn, ErrorToast } from "@/lib/utils";
import { submitModuleAnswer } from "@/services/user-progress.service";
import { SurveyIntro } from "./SurveyIntro";
import { ModuleSwipeQuestion } from "./question-types/ModuleSwipeQuestion";
import AnimationWrapper from "@/components/ui/custom/animation-wrapper";

type AnswerValue = string | number | string[];

export const initialAnswer = (question?: ModuleQuestion): AnswerValue | null => {
  if (question?.type === "Ordering") return [...(question.items ?? [])];
  return null;
};

export const hasAnswer = (answer: AnswerValue | null) => {
  if (answer === null) return false;
  if (typeof answer === "string") return answer.trim().length > 0;
  if (Array.isArray(answer)) return answer.length > 0;
  return true;
};

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
      setResult(response.data);
      setFinalResult(response.data);
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
        onBack={() => router.push("/modules")}
      />
    );
  }

  if (isCompleted) {
    return (
      <AnimationWrapper direction="up" duration={0.4}>
        <div className="flex min-h-[50vh] flex-1 flex-col justify-between">
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

  return (
    <div className="flex flex-1 min-h-0 h-full flex-col overflow-hidden rounded-lg border border-secondary/50 bg-secondary p-3 shadow-sm animate-fadeIn">
      <div className="flex shrink-0 items-center gap-3 pb-2.5 pt-1">
        <span className="whitespace-nowrap text-xs font-bold text-secondary-foreground/80">
          Q{currentIndex + 1}/{totalQuestions}
        </span>
        <Progress value={displayedProgress} className="h-1.5 flex-1" />
      </div>

      <AnimationWrapper key={currentIndex} direction="left" duration={0.4} className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 space-y-4 rounded-lg bg-background/45 p-3 overflow-y-auto pr-1.5 scrollbar-thin">
          {question.type !== "Swipe" && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {question.type}
              </span>
              <h1 className="mt-2 font-heading text-xl font-bold leading-snug">
                {question.content}
              </h1>
              {question.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={question.image as string}
                  alt=""
                  className="mt-4 max-h-48 w-full rounded-lg border bg-background object-contain"
                />
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
          />

          {result && (
            <AnimationWrapper direction="up" duration={0.3} delay={0.1}>
              <div
                className={cn(
                  "rounded-lg border p-4 text-sm",
                  result.isCorrect === false
                    ? "border-destructive/30 bg-destructive/10"
                    : "border-success/30 bg-success/10",
                )}
              >
                <p className="font-bold">
                  {result.isCorrect === false
                    ? "Not quite right"
                    : result.isCorrect === true
                      ? "Correct answer"
                      : "Answer submitted"}
                </p>
                {result.explanation && (
                  <p className="mt-1 text-muted-foreground">{result.explanation}</p>
                )}
                {result.isCorrect === false && result.correctAnswer && (
                  <p className="mt-2 font-medium">
                    Correct answer:{" "}
                    {Array.isArray(result.correctAnswer)
                      ? result.correctAnswer.join(" → ")
                      : result.correctAnswer}
                  </p>
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
            {currentIndex === totalQuestions - 1 ||
            result.moduleStatus === "completed"
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
            {isSubmitting ? "Submitting..." : "Submit answer"}
            {!isSubmitting && <ArrowRight />}
          </Button>
        )}
      </div>
    </div>
  );
}

export function QuestionAnswer({
  question,
  answer,
  disabled,
  onAnswer,
  onSwipe,
}: {
  question: ModuleQuestion;
  answer: AnswerValue | null;
  disabled: boolean;
  onAnswer: (answer: AnswerValue) => void;
  onSwipe: (direction: "left" | "right") => void;
}) {
  if (question.type === "Information") {
    return (
      <div className="space-y-4 rounded-lg border bg-card p-4">
        {question.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={question.image}
            alt=""
            className="max-h-56 w-full rounded-lg border bg-background object-contain"
          />
        )}
        <Button
          type="button"
          variant={answer === "reviewed" ? "default" : "outline"}
          disabled={disabled}
          onClick={() => onAnswer("reviewed")}
          className="w-full"
        >
          <CheckCircle2 /> {answer === "reviewed" ? "Reviewed" : "Mark as reviewed"}
        </Button>
      </div>
    );
  }
  if (question.type === "MCQ") {
    return (
      <div className="space-y-3">
        {(question.options ?? []).map((option) => (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onAnswer(option)}
            className={cn(
              "w-full rounded-lg border bg-background p-4 text-left text-sm transition-colors",
              answer === option
                ? "border-primary bg-primary/10 font-semibold"
                : "hover:border-primary/50",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  if (question.type === "Swipe") {
    return (
      <ModuleSwipeQuestion
        key={question.id}
        question={question}
        disabled={disabled}
        onSwipe={onSwipe}
      />
    );
  }

  if (question.type === "Ordering") {
    const items = Array.isArray(answer) ? answer : question.items ?? [];
    const move = (index: number, offset: number) => {
      const nextIndex = index + offset;
      if (nextIndex < 0 || nextIndex >= items.length) return;
      const updated = [...items];
      [updated[index], updated[nextIndex]] = [updated[nextIndex], updated[index]];
      onAnswer(updated);
    };

    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              layout: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            key={item}
            className="flex items-center gap-3 rounded-lg border bg-background p-3"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded bg-muted text-sm font-bold">
              {index + 1}
            </span>
            <span className="flex-1 text-sm">{item}</span>
            <div className="flex gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={disabled || index === 0}
                onClick={() => move(index, -1)}
              >
                <ArrowUp />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={disabled || index === items.length - 1}
                onClick={() => move(index, 1)}
              >
                <ArrowDown />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (question.type === "Chat Scenario") {
    const options = question.options ?? [];

    return (
      <div className="space-y-4">
        <div className="min-h-80 space-y-3 rounded-lg border bg-muted/30 p-4">
          {(question.messages ?? []).filter(msg => msg.sender || msg.text).map((message, index) => (
            <div
              key={`${message.sender}-${index}`}
              className={cn(
                "max-w-[85%] rounded-xl p-3 text-sm bg-background",
              )}
            >
              <p className="mb-1 text-[10px] font-bold uppercase opacity-70">
                {message.sender}
              </p>
              {message.text}
            </div>
          ))}
          {typeof answer === "string" && answer !== "completed" && (
            <div className="ml-auto max-w-[85%] rounded-xl bg-primary p-3 text-sm text-primary-foreground">
              {answer}
            </div>
          )}
        </div>

        {options.length > 0 ? (
          <div className="space-y-2 rounded-lg border bg-background p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Choose your response
            </p>
            {options.map((option) => (
              <button
                key={option}
                type="button"
                disabled={disabled}
                onClick={() => onAnswer(option)}
                className={cn(
                  "w-full rounded-md border p-3 text-left text-sm transition-colors",
                  answer === option
                    ? "border-primary bg-primary/10 font-semibold"
                    : "hover:border-primary/50",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <Button
            type="button"
            variant={answer === "completed" ? "default" : "outline"}
            disabled={disabled}
            onClick={() => onAnswer("completed")}
            className="w-full"
          >
            <MessageCircle /> I reviewed this conversation
          </Button>
        )}
      </div>
    );
  }

  if (question.type === "Simulated Call") {
    return (
      <SimulatedCallQuestion
        question={question}
        answer={answer}
        disabled={disabled}
        onComplete={() => onAnswer("completed")}
      />
    );
  }
  if (question.type === "Video") {
    const videoUrl = question.videoUrl ?? "";
    const youtubeId =
      videoUrl.match(/(?:youtu\.be\/|v=)([\w-]{11})/)?.[1] ?? undefined;
    const hasOptions = Array.isArray(question.options) && question.options.length > 0;

    return (
      <div className="space-y-4">
        <div className="aspect-video overflow-hidden rounded-lg bg-black">
          {youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={question.content}
              className="size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={videoUrl} controls className="size-full" />
          )}
        </div>
        {hasOptions ? (
          <div className="space-y-3 pt-2">
            {question.options?.map((option) => (
              <button
                key={option}
                type="button"
                disabled={disabled}
                onClick={() => onAnswer(option)}
                className={cn(
                  "w-full rounded-lg border bg-background p-4 text-left text-sm transition-colors",
                  answer === option
                    ? "border-primary bg-primary/10 font-semibold"
                    : "hover:border-primary/50",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <Button
            type="button"
            variant={answer === "watched" ? "default" : "outline"}
            disabled={disabled}
            onClick={() => onAnswer("watched")}
            className="w-full"
          >
            <Play /> Mark as watched
          </Button>
        )}
      </div>
    );
  }

  if (question.type === "Rating") {
    return (
      <div className="grid grid-cols-5 gap-2 py-5">
        {Array.from({ length: question.scale ?? 5 }, (_, index) => index + 1).map(
          (rating) => (
            <Button
              key={rating}
              type="button"
              variant={answer === rating ? "default" : "outline"}
              disabled={disabled}
              onClick={() => onAnswer(rating)}
            >
              {rating}
            </Button>
          ),
        )}
      </div>
    );
  }

  return (
    <Textarea
      value={typeof answer === "string" ? answer : ""}
      disabled={disabled}
      placeholder="Write your answer..."
      className="min-h-36 bg-background"
      onChange={(event) => onAnswer(event.target.value)}
    />
  );
}

function SimulatedCallQuestion({
  question,
  answer,
  disabled,
  onComplete,
}: {
  question: ModuleQuestion;
  answer: AnswerValue | null;
  disabled: boolean;
  onComplete: () => void;
}) {
  const [hasAnswered, setHasAnswered] = useState(answer === "completed");
  const [dragOffset, setDragOffset] = useState(0);
  const isComplete = answer === "completed";
  const callerName = question.callerName || "Training caller";

  if (!hasAnswered) {
    return (
      <div className="relative flex min-h-[34rem] overflow-hidden rounded-lg border bg-foreground text-background shadow-sm">
        {question.callerPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={question.callerPhoto}
            alt=""
            className="absolute inset-0 size-full scale-110 object-cover opacity-45 blur-xl"
          />
        )}
        <div className="absolute inset-0 bg-foreground/55" />

        <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-between px-6 py-10 text-center">
          <div className="space-y-8">
            <p className="text-lg text-background/80">Incoming call...</p>
            <div className="mx-auto flex size-40 items-center justify-center overflow-hidden rounded-full border border-background/80 bg-background/15 shadow-sm">
              {question.callerPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={question.callerPhoto}
                  alt={callerName}
                  className="size-full object-cover"
                />
              ) : (
                <UserRound className="size-16 text-background/80" />
              )}
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold text-background">
                {callerName}
              </h2>
              <p className="mt-3 text-sm text-background/75">{question.content}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center text-background/35">
              <ArrowUp className="size-8" />
              <ArrowUp className="-mt-3 size-8 text-background/50" />
              <ArrowUp className="-mt-3 size-8 text-background/75" />
            </div>
            <motion.button
              type="button"
              disabled={disabled}
              drag="y"
              dragConstraints={{ top: -120, bottom: 0 }}
              dragElastic={0.08}
              animate={{ y: dragOffset }}
              whileTap={{ scale: disabled ? 1 : 0.96 }}
              onDrag={(_, info) => setDragOffset(Math.min(0, info.offset.y))}
              onDragEnd={(_, info) => {
                if (disabled) return;
                if (info.offset.y < -72) {
                  setDragOffset(-120);
                  window.setTimeout(() => setHasAnswered(true), 120);
                  return;
                }
                setDragOffset(0);
              }}
              className="flex size-16 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg shadow-foreground/30 ring-6 ring-background/15 disabled:opacity-60"
              aria-label="Swipe up to answer call"
            >
              <Phone className="size-7" />
            </motion.button>
            <p className="text-xs font-semibold uppercase tracking-wider text-background/60">
              Swipe up to answer
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      {question.postCallVideoUrl && (
        <div className="aspect-video overflow-hidden rounded-lg bg-black">
          <video
            src={question.postCallVideoUrl}
            controls
            autoPlay
            playsInline
            className="size-full"
          />
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          Call complete
        </p>
        <h2 className="font-heading text-xl font-bold">{callerName}</h2>
        {question.postCallMessage && (
          <p className="text-sm text-muted-foreground">
            {question.postCallMessage}
          </p>
        )}
      </div>

      <Button
        type="button"
        variant={isComplete ? "default" : "outline"}
        disabled={disabled}
        onClick={onComplete}
        className="w-full"
      >
        <CheckCircle2 /> {isComplete ? "Call reviewed" : "Mark call as reviewed"}
      </Button>
    </div>
  );
}


