"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/custom/confirmation-modal";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { LearningModule } from "@/lib/types/module.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { deleteModule, duplicateModule } from "@/services/module.service";

export function ModuleActions({ module }: { module: LearningModule }) {
  const router = useRouter();
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState(`Copy of ${module.title}`);

  const handleDuplicate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDuplicating(true);

    try {
      const response = await duplicateModule(module._id, { title });
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Module duplicated successfully");
      setDuplicateOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to duplicate module");
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await deleteModule(module._id);
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Module deleted successfully");
      setDeleteOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to delete module");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild variant="outline" size="icon">
        <Link
          href={`/super-admin/course/${module._id}/edit`}
          aria-label={`Edit ${module.title}`}
          title="Edit module"
        >
          <Pencil />
        </Link>
      </Button>

      <ModalWrapper
        open={duplicateOpen}
        onOpenChange={setDuplicateOpen}
        title="Duplicate Module"
        description="Choose a title for the duplicated module."
        actionTrigger={
          <Button type="button" variant="outline" size="icon" title="Duplicate module">
            <Copy />
          </Button>
        }
      >
        <form onSubmit={handleDuplicate} className="space-y-6">
          <Field>
            <FieldLabel htmlFor={`duplicate-${module._id}`}>Module Title</FieldLabel>
            <Input
              id={`duplicate-${module._id}`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setDuplicateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isDuplicating}>
              {isDuplicating ? "Duplicating..." : "Duplicate"}
            </Button>
          </div>
        </form>
      </ModalWrapper>

      <ConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete module?"
        description={`Are you sure you want to delete ${module.title}? This action cannot be undone.`}
        confirmText="Delete"
        loadingText="Deleting..."
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
        actionTrigger={
          <Button type="button" variant="destructive" size="icon" title="Delete module">
            <Trash2 />
          </Button>
        }
      />
    </div>
  );
}
