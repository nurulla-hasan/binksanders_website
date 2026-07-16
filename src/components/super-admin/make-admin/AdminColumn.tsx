"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Ban, ShieldCheck, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/custom/confirmation-modal";
import type { AdminAccount } from "@/lib/types/admin.type";
import { ErrorToast, getInitials, SuccessToast } from "@/lib/utils";
import { deleteAdmin, toggleAdminBlock } from "@/services/admin.service";

function ActionButtons({ admin }: { admin: AdminAccount }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleToggleStatus = async () => {
    setIsUpdating(true);

    try {
      const response = await toggleAdminBlock(admin._id);
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Admin status updated");
      setIsStatusModalOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error
          ? error.message
          : "Unable to update admin status",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await deleteAdmin(admin._id);
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Admin deleted successfully");
      setIsDeleteModalOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to delete admin",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <ConfirmationModal
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        title={`${admin.status === "active" ? "Block" : "Unblock"} admin?`}
        description={`Are you sure you want to ${admin.status === "active" ? "block" : "unblock"} ${admin.fullName}?`}
        confirmText={admin.status === "active" ? "Block" : "Unblock"}
        loadingText={
          admin.status === "active" ? "Blocking..." : "Unblocking..."
        }
        onConfirm={handleToggleStatus}
        isLoading={isUpdating}
        variant={admin.status === "active" ? "destructive" : "default"}
        actionTrigger={
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isUpdating || isDeleting}
            aria-label={
              admin.status === "active" ? "Block admin" : "Unblock admin"
            }
            title={admin.status === "active" ? "Block admin" : "Unblock admin"}
          >
            {admin.status === "active" ? <Ban /> : <ShieldCheck />}
          </Button>
        }
      >
        {admin.status === "active" && (
          <p className="text-sm text-muted-foreground">
            This administrator will no longer be able to access the dashboard.
          </p>
        )}
      </ConfirmationModal>
      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete admin?"
        description={`Are you sure you want to delete ${admin.fullName}? This action cannot be undone.`}
        confirmText="Delete"
        loadingText="Deleting..."
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
        actionTrigger={
          <Button
            type="button"
            variant="destructive"
            size="icon"
            disabled={isDeleting || isUpdating}
            aria-label="Delete admin"
            title="Delete admin"
          >
            <Trash2 />
          </Button>
        }
      />
    </div>
  );
}

export const columns: ColumnDef<AdminAccount>[] = [
  {
    accessorKey: "fullName",
    header: "Admin",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar>
          {row.original.image && (
            <AvatarImage src={row.original.image} alt={row.original.fullName} />
          )}
          <AvatarFallback>{getInitials(row.original.fullName)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">{row.original.fullName}</p>
          <p className="text-xs text-muted-foreground">{row.original.role}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.phone || "—"}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "active" : "blocked"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <ActionButtons admin={row.original} />,
  },
];
