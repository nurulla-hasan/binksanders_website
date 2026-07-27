"use client";

import { getTrainingColumns } from "@/components/super-admin/training/TrainingColumn";
import { DataTable } from "@/components/ui/custom/data-table";
import type { CompanyDropdownItem } from "@/lib/types/company.type";
import type { Training } from "@/lib/types/training.type";

type TrainingTableMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type TrainingDirectoryTableProps = {
  trainings: Training[];
  companies: CompanyDropdownItem[];
  meta?: TrainingTableMeta;
  limit: number;
};

export function TrainingDirectoryTable({
  trainings,
  companies,
  meta,
  limit,
}: TrainingDirectoryTableProps) {
  return (
    <DataTable
      columns={getTrainingColumns(companies)}
      data={trainings}
      meta={meta}
      limit={limit}
      searchKey="searchTerm"
      searchPlaceholder="Search trainings..."
    />
  );
}