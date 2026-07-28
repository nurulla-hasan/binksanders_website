"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, MessageCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ModuleSwipeQuestion } from "../question-types/ModuleSwipeQuestion";
import { optionLabel } from "./answer-utils";
import { MediaVideo } from "./media";
import { SimulatedCallQuestion } from "./SimulatedCallQuestion";
import type { AnswerRendererProps, MediaValue } from "./types";

export function QuestionAnswer({
  question,
  answer,
  disabled,
  onAnswer,
  onSwipe,
  onAutoSubmit,
  correctAnswer,
  isSubmitted = false,
}: AnswerRendererProps & { onAutoSubmit?: (value: string) => void }) {
  if (question.type === "Information") {
    return null;
  }

  if (question.type === "MCQ") {
    return (
      <div className="space-y-3">
        {(question.options ?? []).map((option, optionIndex) => {
          const selected = answer === option;
          const hasCorrectAnswer = correctAnswer !== undefined && correctAnswer !== null && !(typeof correctAnswer === "string" && correctAnswer.trim() === "");
          const isCorrectOption = isSubmitted && hasCorrectAnswer && correctAnswer === option;
          const isWrongSelection = isSubmitted && hasCorrectAnswer && selected && correctAnswer !== option;
          const isDimmed = isSubmitted && hasCorrectAnswer && !isCorrectOption && !isWrongSelection;

          return (
            <button
              key={`${option}-${optionIndex}`}
              type="button"
              disabled={disabled}
              onClick={() => onAnswer(option)}
              className={cn(
                "group flex w-full min-w-0 items-center gap-3 rounded-sm border p-4 text-left text-sm transition-colors",
                isCorrectOption && "border-2 border-success bg-background font-semibold text-foreground",
                isWrongSelection && "border-2 border-primary bg-background font-semibold text-foreground",
                !isSubmitted && selected && "border-2 border-success bg-background font-semibold",
                !isSubmitted && !selected && "border-border bg-background hover:border-primary/50",
                isDimmed && "border-transparent bg-black/5 text-muted-foreground opacity-60",
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-sm bg-muted text-xs font-bold text-muted-foreground transition-colors",
                  (isCorrectOption || (!isSubmitted && selected)) && "bg-success text-white",
                  isWrongSelection && "bg-primary text-primary-foreground",
                  isDimmed && "bg-black/10 text-muted-foreground"
                )}
              >
                {optionLabel(optionIndex)}
              </span>
              <span className="min-w-0 flex-1 wrap-break-word">
                {option}
              </span>
            </button>
          );
        })}
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
              opacity: { duration: 0.2 },
            }}
            key={`${item}-${index}`}
            className="flex items-center gap-3 rounded-lg border bg-background p-3"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded bg-muted text-sm font-bold">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 wrap-break-word text-sm">{item}</span>
            <div className="flex gap-1">
              <Button type="button" size="icon" variant="ghost" disabled={disabled || index === 0} onClick={() => move(index, -1)}>
                <ArrowUp />
              </Button>
              <Button type="button" size="icon" variant="ghost" disabled={disabled || index === items.length - 1} onClick={() => move(index, 1)}>
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
        <div className="min-h-80 space-y-4 rounded-sm border border-background bg-background/10 p-4">
          {(question.messages ?? []).filter((msg) => msg.sender || msg.text).map((message, index) => (
            <div key={`${message.sender}-${index}`} className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MessageCircle className="size-4" />
              </div>
              <div className="max-w-[78%] rounded-sm bg-muted p-3 text-sm text-foreground">
                <p className="wrap-break-word">{message.text}</p>
              </div>
            </div>
          ))}
          {typeof answer === "string" && answer !== "completed" && (
            <div className="ml-auto max-w-[78%] rounded-sm bg-primary p-3 text-sm font-semibold text-primary-foreground">
              <p className="wrap-break-word">{answer}</p>
            </div>
          )}
        </div>

        {options.length > 0 ? (
          <div className="space-y-3 rounded-sm border bg-background p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Choose your response
            </p>
            {options.map((option, optionIndex) => {
              const selected = answer === option;
          const hasCorrectAnswer = correctAnswer !== undefined && correctAnswer !== null && !(typeof correctAnswer === "string" && correctAnswer.trim() === "");
          const isCorrectOption = isSubmitted && hasCorrectAnswer && correctAnswer === option;
          const isWrongSelection = isSubmitted && hasCorrectAnswer && selected && correctAnswer !== option;
          const isDimmed = isSubmitted && hasCorrectAnswer && !isCorrectOption && !isWrongSelection;

              return (
                <button
                  key={`${option}-${optionIndex}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => onAnswer(option)}
                  className={cn(
                    "w-full min-w-0 rounded-sm border p-3 text-left text-sm transition-colors wrap-break-word",
                    isCorrectOption && "border-2 border-success bg-background font-semibold text-foreground",
                    isWrongSelection && "border-2 border-primary bg-background font-semibold text-foreground",
                    !isSubmitted && selected && "border-2 border-primary bg-background font-semibold",
                    !isSubmitted && !selected && "border-border bg-background hover:border-primary/50",
                    isDimmed && "border-transparent bg-black/5 text-muted-foreground opacity-60",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          <Button type="button" variant={answer === "completed" ? "default" : "outline"} disabled={disabled} onClick={() => onAnswer("completed")} className="w-full">
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
        onComplete={() => {
          onAnswer("completed");
          if (onAutoSubmit) {
            onAutoSubmit("completed");
          }
        }}
      />
    );
  }

  if (question.type === "Video") {
    const videoUrl = question.videoUrl ?? "";
    const videoSrc = videoUrl as MediaValue;
    const youtubeId =
      typeof videoUrl === "string"
        ? videoUrl.match(/(?:youtu\.be\/|v=)([\w-]{11})/)?.[1] ?? undefined
        : undefined;
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
            <MediaVideo value={videoSrc} className="size-full" />
          )}
        </div>
        {hasOptions ? (
          <div className="space-y-3 pt-2">
            {question.options?.map((option, optionIndex) => {
              const selected = answer === option;
          const hasCorrectAnswer = correctAnswer !== undefined && correctAnswer !== null && !(typeof correctAnswer === "string" && correctAnswer.trim() === "");
          const isCorrectOption = isSubmitted && hasCorrectAnswer && correctAnswer === option;
          const isWrongSelection = isSubmitted && hasCorrectAnswer && selected && correctAnswer !== option;
          const isDimmed = isSubmitted && hasCorrectAnswer && !isCorrectOption && !isWrongSelection;

              return (
                <button
                  key={`${option}-${optionIndex}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => onAnswer(option)}
                  className={cn(
                    "w-full min-w-0 rounded-sm border p-4 text-left text-sm transition-colors wrap-break-word",
                    isCorrectOption && "border-2 border-success bg-background font-semibold text-foreground",
                    isWrongSelection && "border-2 border-primary bg-background font-semibold text-foreground",
                    !isSubmitted && selected && "border-2 border-primary bg-background font-semibold",
                    !isSubmitted && !selected && "border-border bg-background hover:border-primary/50",
                    isDimmed && "border-transparent bg-black/5 text-muted-foreground opacity-60",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          <Button type="button" variant={answer === "watched" ? "default" : "outline"} disabled={disabled} onClick={() => onAnswer("watched")} className="w-full">
            <Play /> Mark as watched
          </Button>
        )}
      </div>
    );
  }

  if (question.type === "Rating") {
    return (
      <div className="grid grid-cols-5 gap-2 py-5">
        {Array.from({ length: question.scale ?? 5 }, (_, index) => index + 1).map((rating) => (
          <Button key={rating} type="button" variant={answer === rating ? "default" : "outline"} disabled={disabled} onClick={() => onAnswer(rating)}>
            {rating}
          </Button>
        ))}
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






