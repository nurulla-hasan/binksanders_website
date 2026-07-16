"use client";

import { AlertDialog } from "radix-ui";
import { isValidElement, type ReactNode } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "../button";

interface ConfirmationModalProps {
  title?: string;
  description?: string;
  confirmText?: string;
  loadingText?: string;
  cancelText?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  trigger?: ReactNode;
  actionTrigger?: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  children?: ReactNode;
}

export function ConfirmationModal({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  loadingText = "Processing...",
  cancelText = "Cancel",
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  trigger,
  actionTrigger,
  variant = "default",
  children,
}: ConfirmationModalProps) {
  const finalTrigger = actionTrigger || trigger;

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      {finalTrigger !== null && (
        <AlertDialog.Trigger asChild>
          {isValidElement(finalTrigger) ? finalTrigger : (
            <Button variant="outline" size="icon-sm">
              <Trash2 />
            </Button>
          )}
        </AlertDialog.Trigger>
      )}

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-6 text-popover-foreground shadow-sm ring-1 ring-foreground/10 sm:max-w-md">
          <div className="flex flex-col gap-2">
            <AlertDialog.Title className="font-heading text-lg font-medium leading-none">
              {title}
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-muted-foreground">
              {description}
            </AlertDialog.Description>
          </div>

          {children}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                {cancelText}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  onConfirm();
                }}
                variant={variant}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="animate-spin" />}
                {isLoading ? loadingText : confirmText}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
