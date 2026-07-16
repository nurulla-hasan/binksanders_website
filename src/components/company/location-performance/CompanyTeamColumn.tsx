"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Team } from "@/lib/types/team.type";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "name",
    header: "Location / Team",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.updatedAt)}
      </span>
    ),
  },
];
