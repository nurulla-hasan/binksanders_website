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
import type { ModuleQuestion } from "@/lib/types/module.type";

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
  const [isCardDismissed, setIsCardDismissed] = useState(false);
  const isDisabled = disabled || hasSwiped;
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
      x: direction === "right" ? 520 : -520,
      rotate: direction === "right" ? 8 : -8,
      opacity: 0,
      transition: { duration: 0.22, ease: "easeOut" },
    });

    setIsCardDismissed(true);
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

  const shouldShowCard = !disabled && !isCardDismissed;

  return (
    <div className="flex min-h-0 w-full max-w-full flex-1 flex-col overflow-x-hidden">
      {shouldShowCard ? (
        <motion.div
          drag={isDisabled ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.35}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          style={{ x, rotate, touchAction: "pan-y" }}
          animate={controls}
          className="relative z-10 flex min-h-0 w-full max-w-full flex-1 cursor-grab flex-col justify-center overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm will-change-transform active:cursor-grabbing"
        >
          <motion.div
            className="pointer-events-none absolute inset-0 z-0"
            style={{ backgroundColor: overlayColor }}
          />

          <div className="relative z-10 flex h-full min-h-0 flex-col p-6">
            <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
              {question.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={question.image}
                  alt=""
                  className="mb-4 max-h-40 w-full shrink-0 rounded-md object-contain"
                />
              )}
              <h2 className="my-auto w-full py-4 text-center font-heading text-lg font-semibold leading-tight text-foreground">
                {question.content}
              </h2>
            </div>
            <div className="mt-2 flex shrink-0 items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
              <ArrowLeft className="size-4" />
              <span>Swipe to respond</span>
              <ArrowRight className="size-4" />
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="min-h-0 flex-1" aria-hidden="true" />
      )}

      <div className="mt-4 flex w-full max-w-full shrink-0 gap-3">
        <Button
          type="button"
          variant="disagree"
          size="default"
          disabled={isDisabled}
          className="min-w-0 flex-1 text-sm font-bold shadow-sm"
          onClick={() => void submitSwipe("left")}
        >
          <X className="mr-1.5 size-4 stroke-3" />
          {question.leftLabel || "Disagree"}
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
          {question.rightLabel || "Agree"}
        </Button>
      </div>
    </div>
  );
}
