"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, CheckCircle2, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ModuleQuestion } from "@/lib/types/module.type";
import type { AnswerValue, MediaValue } from "./types";
import { MediaImage, MediaVideo } from "./media";

export function SimulatedCallQuestion({
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
      <div className="relative flex min-h-full h-full overflow-hidden rounded-lg border-0 bg-foreground text-background shadow-sm">
        {question.callerPhoto && (
          <MediaImage value={question.callerPhoto as MediaValue} alt="" className="absolute inset-0 size-full scale-110 object-cover opacity-45 blur-xl" />
        )}
        <div className="absolute inset-0 bg-foreground/55" />

        <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-between px-6 py-10 text-center">
          <div className="space-y-8">
            <p className="text-lg text-background/80">Incoming call...</p>
            <div className="mx-auto flex size-40 items-center justify-center overflow-hidden rounded-full border border-background/80 bg-background/15 shadow-sm">
              {question.callerPhoto ? (
                <MediaImage value={question.callerPhoto as MediaValue} alt={callerName} className="size-full object-cover" />
              ) : (
                <UserRound className="size-16 text-background/80" />
              )}
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold text-background">
                {callerName}
              </h2>
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
    <div className="space-y-4 overflow-hidden rounded-lg border bg-card p-4">
      {question.postCallVideoUrl && (
        <div className="aspect-video overflow-hidden rounded-lg bg-black">
          <MediaVideo value={question.postCallVideoUrl as MediaValue} autoPlay className="size-full" />
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          Call complete
        </p>
        <h2 className="font-heading text-xl font-bold wrap-break-word">{callerName}</h2>
        {question.postCallMessage && (
          <p className="wrap-break-word text-sm text-muted-foreground">
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