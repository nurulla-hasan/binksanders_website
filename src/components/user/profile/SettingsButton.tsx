"use client";

import {
  type ComponentProps,
  forwardRef,
  type ComponentType,
} from "react";
import { ChevronRight } from "lucide-react";

export const SettingsButton = forwardRef<
  HTMLButtonElement,
  {
    icon: ComponentType<{ className?: string }>;
    label: string;
  } & ComponentProps<"button">
>(({ icon: Icon, label, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className="flex w-full items-center justify-between rounded-sm bg-muted p-3.5 transition-colors hover:bg-muted/60"
    {...props}
  >
    <div className="flex items-center gap-3">
      <Icon className="size-4 text-foreground/80" />
      <span className="text-[13px] font-medium text-foreground/90">
        {label}
      </span>
    </div>
    <ChevronRight className="size-4 text-muted-foreground/50" />
  </button>
));

SettingsButton.displayName = "SettingsButton";
