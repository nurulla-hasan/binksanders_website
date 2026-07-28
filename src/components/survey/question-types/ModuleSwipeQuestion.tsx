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
  const isDisabled = disabled || hasSwiped;
  const rotate = useTransform(x, [-220, 220], [-12, 12]);
  const overlayColor = useTransform(
    x,
    [-160, 0, 160],
    [
      "rgba(239, 68, 68, 0.35)",
      "rgba(255, 255, 255, 0)",
      "rgba(34, 197, 94, 0.35)",
    ],
  );

  const submitSwipe = (direction: "left" | "right") => {
    if (isDisabled) return;
    setHasSwiped(true);
    void controls.start({
      x: direction === "right" ? 420 : -420,
      rotate: direction === "right" ? 12 : -12,
      opacity: 0.75,
      transition: { duration: 0.35, ease: "easeOut" },
    });
    onSwipe(direction);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      submitSwipe("right");
    } else if (info.offset.x < -100) {
      submitSwipe("left");
    } else {
      void controls.start({
        x: 0,
        rotate: 0,
        transition: { type: "spring", stiffness: 320, damping: 22 },
      });
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full">
      <motion.div
        drag={isDisabled ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.75}
        onDragEnd={handleDragEnd}
        style={{ x, rotate }}
        animate={controls}
        className="relative flex-1 min-h-0 z-10 flex cursor-grab flex-col justify-center overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm active:cursor-grabbing"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ backgroundColor: overlayColor }}
        />

        <div className="relative z-10 flex h-full flex-col p-6 min-h-0">
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center w-full">
            {question.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={question.image}
                alt=""
                className="mb-4 max-h-40 w-full rounded-md object-contain shrink-0"
              />
            )}
            <h2 className="w-full text-center font-heading text-lg font-semibold leading-tight text-foreground my-auto py-4">
              {question.content}
            </h2>
          </div>
          <div className="shrink-0 mt-2 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
            <ArrowLeft className="size-4" />
            <span>Swipe to respond</span>
            <ArrowRight className="size-4" />
          </div>
        </div>
      </motion.div>

      <div className="shrink-0 flex w-full gap-3 mt-4">
        <Button
          type="button"
          variant="disagree"
          size="default"
          disabled={isDisabled}
          className="flex-1 font-bold text-sm shadow-sm"
          onClick={() => submitSwipe("left")}
        >
          <X className="stroke-3 size-4 mr-1.5" />
          {question.leftLabel || "Disagree"}
        </Button>
        <Button
          type="button"
          variant="agree"
          size="default"
          disabled={isDisabled}
          className="flex-1 font-bold text-sm shadow-sm"
          onClick={() => submitSwipe("right")}
        >
          <Check className="stroke-3 size-4 mr-1.5" />
          {question.rightLabel || "Agree"}
        </Button>
      </div>
    </div>
  );
}
