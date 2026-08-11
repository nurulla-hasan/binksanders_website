"use client";

import { useState } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RichQuestionContent } from "@/components/ui/custom/RichQuestionContent";
import { cn } from "@/lib/utils";
import { hasQuestionContent } from "@/lib/question-content";
import type { ModuleQuestion } from "@/lib/types/module.type";
import { MediaImage } from "../module-runner/media";
import type { MediaValue } from "../module-runner/types";

export function ModuleSwipeQuestion({
  question,
  disabled,
  onSwipe,
}: {
  question: ModuleQuestion;
  disabled: boolean;
  onSwipe: (direction: "left" | "right") => void;
}) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [hasSwiped, setHasSwiped] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const isDisabled = disabled || hasSwiped;
  const hasContent = hasQuestionContent(question.content);
  const isImageOnly = Boolean(question.image) && !hasContent;
  const rotate = useTransform(x, [-220, 220], [-8, 8]);
  const overlayColor = useTransform(
    x,
    [-160, 0, 160],
    [
      "rgba(239, 68, 68, 0.35)",
      "rgba(255, 255, 255, 0)",
      "rgba(34, 197, 94, 0.35)",
    ],
  );

  const submitSwipe = async (direction: "left" | "right") => {
    if (isDisabled) return;

    setHasSwiped(true);

    await controls.start({
      x: direction === "right" ? 360 : -360,
      rotate: direction === "right" ? 8 : -8,
      opacity: 0,
      transition: { duration: 0.22, ease: "easeOut" },
    });

    setIsDismissed(true);
    onSwipe(direction);
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const projectedOffset = info.offset.x + info.velocity.x * 0.08;

    if (projectedOffset > 90) {
      void submitSwipe("right");
    } else if (projectedOffset < -90) {
      void submitSwipe("left");
    } else {
      void controls.start({
        x: 0,
        rotate: 0,
        transition: { type: "spring", stiffness: 420, damping: 32 },
      });
    }
  };

  if (isDismissed) return null;

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <motion.div
        drag={isDisabled ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.35}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, touchAction: "pan-y" }}
        animate={controls}
        className="relative z-10 w-full max-w-full cursor-grab overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm will-change-transform active:cursor-grabbing"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-20"
          style={{ backgroundColor: overlayColor }}
        />

        <div className="relative z-10 flex w-full flex-col">
          {question.image && (
            <div
              className={cn(
                "w-full bg-muted/20",
                isImageOnly && "flex items-center justify-center p-2",
              )}
            >
              <MediaImage
                value={question.image as MediaValue}
                alt="Swipe question"
                className={cn(
                  "block object-contain",
                  isImageOnly
                    ? "h-auto max-h-[52dvh] w-auto max-w-full"
                    : "h-auto w-full",
                )}
              />
            </div>
          )}

          {hasContent && (
            <div
              className={
                question.image
                  ? "border-t border-border/60 px-5 py-5"
                  : "px-5 py-7"
              }
            >
              <RichQuestionContent
                value={question.content}
                className="text-center text-lg font-semibold leading-relaxed"
              />
            </div>
          )}

          <div className="flex items-center justify-center gap-2 px-5 pb-4 pt-3 text-xs font-medium text-muted-foreground">
            <ArrowLeft className="size-4" />
            <span>Swipe to respond</span>
            <ArrowRight className="size-4" />
          </div>
        </div>
      </motion.div>

      <div className="mt-4 flex w-full max-w-full gap-3">
        <Button
          type="button"
          variant="disagree"
          size="default"
          disabled={isDisabled}
          className="min-w-0 flex-1 text-sm font-bold shadow-sm"
          onClick={() => void submitSwipe("left")}
        >
          <X className="mr-1.5 size-4 stroke-3" />
          <span className="min-w-0 truncate">
            {question.leftLabel || "Disagree"}
          </span>
        </Button>
        <Button
          type="button"
          variant="agree"
          size="default"
          disabled={isDisabled}
          className="min-w-0 flex-1 text-sm font-bold shadow-sm"
          onClick={() => void submitSwipe("right")}
        >
          <Check className="mr-1.5 size-4 stroke-3" />
          <span className="min-w-0 truncate">
            {question.rightLabel || "Agree"}
          </span>
        </Button>
      </div>
    </div>
  );
}
