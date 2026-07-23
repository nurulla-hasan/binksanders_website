"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Company } from "@/lib/types/company.type";
import { getInitials } from "@/lib/utils";

function ClientActions({ company }: { company: Company }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild type="button" variant="ghost" size="icon">
        <Link
          href={`/super-admin/clients/${company._id}`}
          aria-label={`View ${company.name}`}
          title="View analytics"
        >
          <Eye />
        </Link>
      </Button>
      <Button asChild type="button" variant="ghost" size="icon">
        <Link
          href={`/super-admin/clients/${company._id}/settings`}
          aria-label={`Manage ${company.name}`}
          title="Company settings"
          className="text-primary"
        >
          <Settings />
        </Link>
      </Button>
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
  // {
  //   id: "users",
  //   header: "Users",
  //   cell: ({ row }) => {
  //     const userCount =
  //       row.original.users?.filter((user) => user.role === "user").length;

  //     return (
  //       <span className="font-medium text-muted-foreground">
  //         {userCount ?? "—"}
  //       </span>
  //     );
  //   },
  // },
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
