/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeVideoOverlay({ branding, user }: { branding: any; user: any }) {
  const [show, setShow] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!branding?.videoUrl) return;

    const timer = setTimeout(() => setShow(true), 0);
    return () => clearTimeout(timer);
  }, [branding?.videoUrl]);

  if (!show || !branding?.videoUrl) return null;

  const handleSkip = () => {
    setShow(false);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      void videoRef.current.play();
    }
  };

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-120 flex-col overflow-hidden bg-background text-foreground animate-fadeIn">
      <div className="relative h-[45dvh] w-full shrink-0 bg-black">
        <video
          ref={videoRef}
          src={branding.videoUrl}
          className="size-full object-cover"
          playsInline
          onEnded={handleSkip}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Play welcome video"
              className="flex size-16 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform hover:scale-105"
            >
              <Play className="ml-1 size-8" />
            </button>
          </div>
        )}
      </div>

      <div className="h-0.5 w-full bg-primary" />

      <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Welcome Message
            </p>
            <h1 className="font-heading text-lg font-semibold">
              Hi {user?.firstName || user?.fullName || "there"}, welcome to the program
            </h1>
          </div>

          {branding.videoDescription && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {branding.videoDescription}
            </p>
          )}

          {(branding.presenterName || branding.presenterDesignation) && (
            <div className="rounded-lg border bg-card p-4">
              {branding.presenterName && (
                <p className="text-sm font-bold uppercase tracking-wider">
                  {branding.presenterName}
                </p>
              )}
              {branding.presenterDesignation && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {branding.presenterDesignation}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 shrink-0 space-y-4 pb-4">
          <Button
            size="lg"
            className="w-full text-base font-bold uppercase"
            onClick={handleSkip}
          >
            Skip to the program <ArrowRight className="ml-2 size-4" />
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
            POWERED BY
            {branding.logo ? (
              <Image
                src={branding.logo}
                alt="Company Logo"
                width={120}
                height={16}
                className="h-4 w-auto object-contain opacity-50 brightness-0"
              />
            ) : (
              <span className="rounded border px-1.5 py-0.5 uppercase tracking-wider">
                Act Inc.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
