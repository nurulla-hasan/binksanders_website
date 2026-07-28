"use client";

import { useEffect, useState } from "react";
import type { MediaValue } from "./types";

export function MediaImage({
  value,
  alt = "",
  className,
}: {
  value: MediaValue;
  alt?: string;
  className?: string;
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
  return <img src={src} alt={alt} className={className} />;
}

export function MediaVideo({
  value,
  className,
  autoPlay,
}: {
  value: MediaValue;
  className?: string;
  autoPlay?: boolean;
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

  return <video src={src} controls autoPlay={autoPlay} playsInline className={className} />;
}