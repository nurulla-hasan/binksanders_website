"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ModuleActions } from "./ModuleActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { LearningModule } from "@/lib/types/module.type";
import { formatDate, getInitials } from "@/lib/utils";

export const columns: ColumnDef<LearningModule>[] = [
  {
    accessorKey: "title",
    header: "Module",
    cell: ({ row }) => (
      <div className="flex min-w-64 items-center gap-3">
        <Avatar>
          {row.original.thumbnailImage && (
            <AvatarImage
              src={row.original.thumbnailImage}
              alt={row.original.title}
            />
          )}
          <AvatarFallback>{getInitials(row.original.title)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">{row.original.title}</p>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {row.original.description}
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "questions",
    header: "Questions",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.questions.length}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "published" ? "active" : "outline"}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "createdBy",
    header: "Created By",
    cell: ({ row }) => (
      <div>
        <p className="text-sm text-foreground">
          {`${row.original.createdBy.firstName} ${row.original.createdBy.lastName}`.trim()}
        </p>
        <p className="text-xs text-muted-foreground">
          {row.original.createdBy.email}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.updatedAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <ModuleActions module={row.original} />,
  },
];
