"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { CompanyBreakdown } from "@/lib/types/dashboard.type";

export const companyBreakdownColumns: ColumnDef<CompanyBreakdown>[] = [
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <Link
        href={`/super-admin/clients/${row.original.companyId}`}
        className="font-medium text-foreground hover:text-primary hover:underline"
      >
        {row.original.company}
      </Link>
    ),
  },
  {
    accessorKey: "activeUsers",
    header: () => <div className="text-center">Active Users</div>,
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground">
        {row.original.activeUsers.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "modulesBuilt",
    header: () => <div className="text-center">Modules Built</div>,
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground">
        {row.original.modulesBuilt.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "platformStatus",
    header: () => <div className="pr-4 text-right">Platform Status</div>,
    cell: ({ row }) => {
      const isActive = row.original.platformStatus.toLowerCase() === "active";

      return (
        <div className="pr-4 text-right">
          <Badge variant={isActive ? "active" : "destructive"}>
            {row.original.platformStatus}
          </Badge>
        </div>
      );
    },
  },
];
