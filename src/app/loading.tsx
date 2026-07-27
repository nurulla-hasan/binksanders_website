import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 text-foreground">
      <div className="flex w-full max-w-sm flex-col items-center gap-5 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LoaderCircle className="size-8 animate-spin" />
        </div>
        <div className="space-y-1">
          <h1 className="font-heading text-xl font-bold">Loading</h1>
          <p className="text-sm text-muted-foreground">
            Please wait while we prepare your experience.
          </p>
        </div>
      </div>
    </main>
  );
}

