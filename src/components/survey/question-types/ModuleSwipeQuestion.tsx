"use client";

import { useRef, useState } from "react";
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
  const startXRef = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const isDisabled = disabled || hasSubmitted;

  const submitSwipe = (direction: "left" | "right") => {
    if (isDisabled) return;

    // Remove the card before the parent result state updates. This avoids the
    // persistent composited transform layer seen on some mobile browsers.
    setHasSubmitted(true);
    setDragX(0);
    onSwipe(direction);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    startXRef.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isDisabled || startXRef.current === null) return;

    const nextX = event.clientX - startXRef.current;
    setDragX(Math.max(-140, Math.min(140, nextX)));
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startXRef.current === null) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    startXRef.current = null;

    if (dragX >= 90) {
      submitSwipe("right");
      return;
    }

    if (dragX <= -90) {
      submitSwipe("left");
      return;
    }

    setDragX(0);
  };

  const rotation = dragX / 24;
  const overlayOpacity = Math.min(Math.abs(dragX) / 140, 0.35);
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
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          style={{
            transform: `translate3d(${dragX}px, 0, 0) rotate(${rotation}deg)`,
            transition: startXRef.current === null ? "transform 180ms ease-out" : "none",
            touchAction: "pan-y",
          }}
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

      <div className="mt-4 flex w-full max-w-full shrink-0 gap-3">
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
