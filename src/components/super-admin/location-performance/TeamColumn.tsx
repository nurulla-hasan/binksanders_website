"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/custom/confirmation-modal";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { TeamRow } from "@/lib/types/team.type";
import { ErrorToast, formatDate, SuccessToast } from "@/lib/utils";
import { deleteTeam, updateTeam } from "@/services/team.service";

function TeamActions({ team }: { team: TeamRow }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState(team.name);
  const [passcode, setPasscode] = useState("");

  const handleEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsEditing(true);

    try {
      const response = await updateTeam(team._id, {
        name,
        ...(passcode && { passcode }),
      });
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Team updated successfully");
      setPasscode("");
      setEditOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to update team");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await deleteTeam(team._id);
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Team deleted successfully");
      setDeleteOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to delete team");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <ModalWrapper open={editOpen} onOpenChange={setEditOpen} title="Edit Team" actionTrigger={<Button type="button" variant="outline" size="icon"><Pencil /></Button>}>
        <form onSubmit={handleEdit} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`teamName-${team._id}`}>Team Name</FieldLabel>
              <Input id={`teamName-${team._id}`} value={name} onChange={(event) => setName(event.target.value)} required />
            </Field>
            <Field>
              <FieldLabel htmlFor={`teamPasscode-${team._id}`}>New Passcode</FieldLabel>
              <Input id={`teamPasscode-${team._id}`} type="password" value={passcode} onChange={(event) => setPasscode(event.target.value)} placeholder="Leave blank to keep current" />
            </Field>
          </FieldGroup>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isEditing}>{isEditing ? "Saving..." : "Save Changes"}</Button>
          </div>
        </form>
      </ModalWrapper>
      <ConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete team?"
        description={`Are you sure you want to delete ${team.name}? This action cannot be undone.`}
        confirmText="Delete"
        loadingText="Deleting..."
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
        actionTrigger={<Button type="button" variant="destructive" size="icon"><Trash2 /></Button>}
      />
    </div>
  );
}

export const columns: ColumnDef<TeamRow>[] = [
  { accessorKey: "name", header: "Team", cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name}</span> },
  { accessorKey: "companyName", header: "Company", cell: ({ row }) => <span className="text-muted-foreground">{row.original.companyName}</span> },
  { accessorKey: "createdAt", header: "Created", cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.createdAt)}</span> },
  { id: "actions", header: () => <div className="text-right">Actions</div>, cell: ({ row }) => <TeamActions team={row.original} /> },
];
