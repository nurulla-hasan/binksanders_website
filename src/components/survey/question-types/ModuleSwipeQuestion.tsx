"use client";

import {
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ModuleQuestion } from "@/lib/types/module.type";

type SwipeDirection = "left" | "right";

type StartPoint = {
  x: number;
  y: number;
};

const SWIPE_THRESHOLD = 70;
const MAX_DRAG_DISTANCE = 140;

export function ModuleSwipeQuestion({
  question,
  disabled,
  onSwipe,
}: {
  question: ModuleQuestion;
  disabled: boolean;
  onSwipe: (direction: SwipeDirection) => void;
}) {
  const startPointRef = useRef<StartPoint | null>(null);
  const dragXRef = useRef(0);
  const submittedRef = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [submittedDirection, setSubmittedDirection] =
    useState<SwipeDirection | null>(null);

  const isDisabled = disabled || submittedDirection !== null;

  const resetGesture = () => {
    startPointRef.current = null;
    dragXRef.current = 0;
    setDragX(0);
  };

  const submitSwipe = (direction: SwipeDirection) => {
    if (isDisabled || submittedRef.current) return;

    submittedRef.current = true;
    setSubmittedDirection(direction);
    resetGesture();
    onSwipe(direction);
  };

  const startGesture = (x: number, y: number) => {
    if (isDisabled) return;

    startPointRef.current = { x, y };
    dragXRef.current = 0;
    setDragX(0);
  };

  const updateGesture = (x: number, y: number) => {
    const startPoint = startPointRef.current;
    if (!startPoint || isDisabled) return;

    const deltaX = x - startPoint.x;
    const deltaY = y - startPoint.y;

    // Preserve normal vertical page scrolling. Only treat the gesture as a
    // swipe when horizontal movement is dominant.
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    const nextDragX = Math.max(
      -MAX_DRAG_DISTANCE,
      Math.min(MAX_DRAG_DISTANCE, deltaX),
    );

    dragXRef.current = nextDragX;
    setDragX(nextDragX);
  };

  const finishGesture = () => {
    if (!startPointRef.current) return;

    const completedDragX = dragXRef.current;
    resetGesture();

    if (completedDragX >= SWIPE_THRESHOLD) {
      submitSwipe("right");
      return;
    }

    if (completedDragX <= -SWIPE_THRESHOLD) {
      submitSwipe("left");
    }
  };

  const cancelGesture = () => {
    resetGesture();
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    startGesture(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    updateGesture(touch.clientX, touch.clientY);
  };

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    startGesture(event.clientX, event.clientY);
  };

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return;
    updateGesture(event.clientX, event.clientY);
  };

  const overlayOpacity = Math.min(
    Math.abs(dragX) / MAX_DRAG_DISTANCE,
    0.35,
  );
  const overlayColor =
    dragX > 0
      ? `rgba(34, 197, 94, ${overlayOpacity})`
      : `rgba(239, 68, 68, ${overlayOpacity})`;

  return (
    <div className="flex min-h-0 w-full max-w-full flex-1 flex-col overflow-hidden">
      {!isDisabled && (
        <div
          role="group"
          aria-label="Swipe response card"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={finishGesture}
          onTouchCancel={cancelGesture}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={finishGesture}
          onMouseLeave={finishGesture}
          style={{ touchAction: "pan-y", userSelect: "none" }}
          className="relative z-10 flex min-h-0 w-full max-w-full flex-1 cursor-grab flex-col justify-center overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm active:cursor-grabbing"
        >
          <div
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
        </div>
      )}

      <div className="mt-4 flex w-full max-w-full shrink-0 gap-3 overflow-hidden">
        <Button
          type="button"
          variant="disagree"
          size="default"
          disabled={isDisabled}
          className="min-w-0 flex-1 text-sm font-bold shadow-sm"
          onClick={() => submitSwipe("left")}
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
          onClick={() => submitSwipe("right")}
        >
          <Check className="mr-1.5 size-4 stroke-3" />
          {question.rightLabel || "Agree"}
        </Button>
      </div>
    </div>
  );
}
