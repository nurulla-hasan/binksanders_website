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
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <h2 className="text-4xl font-bold font-heading mb-4 text-foreground">
        Something went wrong!
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
