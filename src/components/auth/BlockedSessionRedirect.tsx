"use client";

import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

export function BlockedSessionRedirect() {
  useEffect(() => {
    window.location.replace("/auth/blocked");
  }, []);

  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-3 text-center">
      <LoaderCircle className="size-7 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Signing you out...</p>
    </div>
  );
}
