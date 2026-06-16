"use client";

import { useMemo } from "react";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/custom/data-table";

export type LocationPerformanceData = {
  location: string;
  activeUser: number;
  progress: string;
  avgScore: string;
};

const tableData: LocationPerformanceData[] = [
  { location: "Utrecht", activeUser: 15, progress: "95%", avgScore: "88%" },
  { location: "Hilversum Store", activeUser: 15, progress: "95%", avgScore: "88%" },
  { location: "Team 05", activeUser: 15, progress: "95%", avgScore: "88%" },
];

export default function LocationPerformancePage() {
  const columns = useMemo<ColumnDef<LocationPerformanceData>[]>(() => [
    {
      accessorKey: "location",
      header: "Location / Team",
      cell: ({ row }) => {
        return <div className="font-medium text-foreground py-2">{row.original.location}</div>;
      },
    },
    {
      accessorKey: "activeUser",
      header: () => <div className="text-center">Active user</div>,
      cell: ({ row }) => {
        return <div className="text-center text-muted-foreground">{row.original.activeUser}</div>;
      },
    },
    {
      accessorKey: "progress",
      header: () => <div className="text-center">Progress</div>,
      cell: ({ row }) => {
        return <div className="text-center text-muted-foreground">{row.original.progress}</div>;
      },
    },
    {
      accessorKey: "avgScore",
      header: () => <div className="text-right">AVG Score</div>,
      cell: ({ row }) => {
        return <div className="text-right text-muted-foreground">{row.original.avgScore}</div>;
      },
    },
  ], []);

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader 
          title="Location & Performance" 
          description="View and manage performance metrics across all locations and teams."
        />
        
        <div className="bg-card border rounded-md p-4 shadow-sm">
          <DataTable
            columns={columns}
            data={tableData}
          />
        </div>
      </DashboardPageLayout>
    </div>
  );
}
