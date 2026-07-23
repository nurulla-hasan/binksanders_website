"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Ban, Eye, ShieldCheck, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/custom/confirmation-modal";
import type { Company } from "@/lib/types/company.type";
import { ErrorToast, getInitials, SuccessToast } from "@/lib/utils";
import { deleteCompany, updateCompanyStatus } from "@/services/company.service";

function ClientActions({ company }: { company: Company }) {
  const router = useRouter();
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isActive = company.status === "active";

  const handleStatus = async () => {
    setIsUpdating(true);

    try {
      const response = await updateCompanyStatus(
        company._id,
        isActive ? "inactive" : "active",
      );
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Client status updated");
      setStatusOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to update client status",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await deleteCompany(company._id);
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Client deleted successfully");
      setDeleteOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to delete client",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild type="button" variant="outline" size="icon">
        <Link
          href={`/super-admin/clients/${company._id}`}
          aria-label={`View ${company.name}`}
          title="View client"
        >
          <Eye />
        </Link>
      </Button>
      <ConfirmationModal
        open={statusOpen}
        onOpenChange={setStatusOpen}
        title={`${isActive ? "Deactivate" : "Activate"} client?`}
        description={`Are you sure you want to ${isActive ? "deactivate" : "activate"} ${company.name}?`}
        confirmText={isActive ? "Deactivate" : "Activate"}
        loadingText={isActive ? "Deactivating..." : "Activating..."}
        onConfirm={handleStatus}
        isLoading={isUpdating}
        variant={isActive ? "destructive" : "default"}
        actionTrigger={
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isUpdating || isDeleting}
            aria-label={isActive ? "Deactivate client" : "Activate client"}
            title={isActive ? "Deactivate client" : "Activate client"}
          >
            {isActive ? <Ban /> : <ShieldCheck />}
          </Button>
        }
      />
      <ConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete client?"
        description={`Are you sure you want to delete ${company.name}? This action cannot be undone.`}
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
            aria-label="Delete client"
            title="Delete client"
          >
            <Trash2 />
          </Button>
        }
      />
    </div>
  );
}

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: "Client",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar>
          {row.original.logo && (
            <AvatarImage src={row.original.logo} alt={row.original.name} />
          )}
          <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.slug}</p>
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
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.address || "—"}</span>
    ),
  },
  {
    id: "users",
    header: "Users",
    cell: ({ row }) => {
      const userCount =
        row.original.users?.filter((user) => user.role === "user").length ?? 0;

      return (
        <span className="font-medium text-muted-foreground">{userCount}</span>
      );
    },
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
    cell: ({ row }) => <ClientActions company={row.original} />,
  },
];
