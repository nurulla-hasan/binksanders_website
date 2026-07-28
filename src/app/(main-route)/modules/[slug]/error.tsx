"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("PAGE ERROR CATCHED:", error);
  }, [error]);

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-bold text-destructive">Something went wrong!</h2>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred while loading this module."}
      </p>
      {error.digest && <p className="text-xs text-muted-foreground">Digest: {error.digest}</p>}
      <Button onClick={() => reset()} variant="outline">
        Try again
      </Button>
    </div>
  );
}
