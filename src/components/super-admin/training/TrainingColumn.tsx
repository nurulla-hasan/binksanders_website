"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { TrainingActions } from "./TrainingActions";
import type { CompanyDropdownItem } from "@/lib/types/company.type";
import type { Training, TrainingCompany } from "@/lib/types/training.type";
import { formatDate } from "@/lib/utils";

const getCompanyName = (company: Training["companyId"]) => {
  if (!company) return "Unassigned";
  if (typeof company === "string") return company;
  return company.firstName || company.email;
};

const getCreatorName = (creator: Training["createdBy"]) => {
  if (!creator) return "System";
  if (typeof creator === "string") return creator;
  return `${creator.firstName} ${creator.lastName || ""}`.trim();
};

export const getTrainingColumns = (companies: CompanyDropdownItem[]): ColumnDef<Training>[] => [
  {
    accessorKey: "title",
    header: "Training",
    cell: ({ row }) => (
      <div className="min-w-72 space-y-1">
        <p className="font-medium text-foreground">{row.original.title}</p>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {row.original.description || "No description"}
        </p>
      </div>
    ),
  },
  {
    id: "company",
    header: "Company",
    cell: ({ row }) => {
      const company = row.original.companyId as TrainingCompany | string | null | undefined;
      return <span className="text-sm text-muted-foreground">{getCompanyName(company)}</span>;
    },
  },
  {
    accessorKey: "authType",
    header: "Auth",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.authType || "Not set"}</Badge>
    ),
  },
  {
    id: "topics",
    header: "Topics",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.topicCount ?? row.original.topics?.length ?? 0}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "published" ? "active" : "outline"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "createdBy",
    header: "Created By",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {getCreatorName(row.original.createdBy)}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.updatedAt || row.original.createdAt || "")}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <TrainingActions training={row.original} companies={companies} />,
  },
];