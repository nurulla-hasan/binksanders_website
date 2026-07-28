"use client";

import { useEffect, useState } from "react";
import type { MediaValue } from "./types";

export function MediaImage({
  value,
  alt = "",
  className,
  onLoad,
}: {
  value: MediaValue;
  alt?: string;
  className?: string;
  onLoad?: () => void;
}) {
  const [objectUrl, setObjectUrl] = useState<string>();
  const src = value instanceof File ? objectUrl : value;

  useEffect(() => {
    if (!(value instanceof File)) return;

    const nextUrl = URL.createObjectURL(value);
    const timer = window.setTimeout(() => setObjectUrl(nextUrl), 0);

    return () => {
      window.clearTimeout(timer);
      URL.revokeObjectURL(nextUrl);
    };
  }, [value]);

  if (!src) return null;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} onLoad={onLoad} />;
}

export function MediaVideo({
  value,
  className,
  autoPlay,
  onEnded,
}: {
  value: MediaValue;
  className?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
}) {
  const [objectUrl, setObjectUrl] = useState<string>();
  const src = value instanceof File ? objectUrl : value;

  useEffect(() => {
    if (!(value instanceof File)) return;

    const nextUrl = URL.createObjectURL(value);
    const timer = window.setTimeout(() => setObjectUrl(nextUrl), 0);

    return () => {
      window.clearTimeout(timer);
      URL.revokeObjectURL(nextUrl);
    };
  }, [value]);

  if (!src) return null;

  return <video src={src} controls autoPlay={autoPlay} playsInline className={className} onEnded={onEnded} />;
}