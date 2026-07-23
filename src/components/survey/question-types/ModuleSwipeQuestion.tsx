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
    <div className="relative mb-20 min-h-112 w-full">
      <motion.div
        drag={isDisabled ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.75}
        onDragEnd={handleDragEnd}
        style={{ x, rotate }}
        animate={controls}
        className="absolute inset-0 z-10 flex cursor-grab flex-col justify-center overflow-hidden rounded-sm border bg-background shadow-md active:cursor-grabbing"
      >
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: overlayColor }}
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-center p-8">
          {question.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={question.image}
              alt=""
              className="mb-5 max-h-48 w-full rounded-md object-contain"
            />
          )}
          <h2 className="w-full text-center font-heading text-2xl font-bold leading-snug text-foreground">
            {question.content}
          </h2>
          <div className="absolute inset-x-0 bottom-7 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
            <ArrowLeft className="size-4" />
            <span>Swipe to respond</span>
            <ArrowRight className="size-4" />
          </div>
        </div>
      </motion.div>

      <div className="absolute -bottom-20 z-20 flex w-full gap-4">
        <Button
          type="button"
          variant="disagree"
          size="lg"
          disabled={isDisabled}
          className="flex-1 font-bold"
          onClick={() => submitSwipe("left")}
        >
          <X className="stroke-3" />
          {question.leftLabel || "Disagree"}
        </Button>
        <Button
          type="button"
          variant="agree"
          size="lg"
          disabled={isDisabled}
          className="flex-1 font-bold"
          onClick={() => submitSwipe("right")}
        >
          <Check className="stroke-3" />
          {question.rightLabel || "Agree"}
        </Button>
      </div>
    </div>
  );
}
