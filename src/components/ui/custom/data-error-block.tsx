import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataErrorBlockProps {
  title?: string;
  message?: string;
  className?: string;
}

export function DataErrorBlock({
  title = "Error Loading Data",
  message = "An error occurred while fetching the required data. Please try again later.",
  className,
}: DataErrorBlockProps) {
  return (
    <div
      className={cn(
        "flex min-h-75 flex-col items-center justify-center rounded-md border border-border bg-card p-6 text-center shadow-sm",
        className
      )}
    >
      <AlertTriangle className="mb-4 size-10 text-destructive/80" />
      <h3 className="mb-2 text-lg font-semibold text-destructive">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
