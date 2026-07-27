"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/custom/confirmation-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Training } from "@/lib/types/training.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { deleteTraining, duplicateTraining } from "@/services/training.service";

export function TrainingActions({ training }: { training: Training }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteTraining(training._id);
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Training deleted successfully");
      setIsDeleteOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to delete training");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newTitle = String(formData.get("newTitle") || "").trim();

    if (!newTitle) {
      ErrorToast("New training title is required");
      return;
    }

    setIsDuplicating(true);
    try {
      const response = await duplicateTraining<Training>(training._id, { newTitle });
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Training duplicated successfully");
      setIsDuplicateOpen(false);
      form.reset();
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to duplicate training");
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Dialog open={isDuplicateOpen} onOpenChange={setIsDuplicateOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="icon" title="Duplicate training">
            <Copy />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Training</DialogTitle>
            <DialogDescription>
              Create a copy of this training with a new title.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDuplicate} className="space-y-5">
            <Field>
              <FieldLabel htmlFor={`duplicate-training-${training._id}`}>
                New Title
              </FieldLabel>
              <Input
                id={`duplicate-training-${training._id}`}
                name="newTitle"
                defaultValue={`${training.title} Copy`}
              />
            </Field>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isDuplicating}
                onClick={() => setIsDuplicateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isDuplicating}>
                <Copy /> {isDuplicating ? "Duplicating..." : "Duplicate"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete training?"
        description="This training will be removed from the directory. Topics and assignments tied to it may no longer be available."
        confirmText="Delete Training"
        loadingText="Deleting..."
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        actionTrigger={
          <Button type="button" variant="ghost" size="icon" title="Delete training">
            <Trash2 />
          </Button>
        }
      />

      <Button asChild variant="outline" size="sm">
        <Link href={`/super-admin/training/${training._id}`}>
          Manage <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}