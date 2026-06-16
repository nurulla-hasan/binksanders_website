"use client";

import { useMemo } from "react";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/custom/data-table";
import { Badge } from "@/components/ui/badge";

type PlatformData = {
  id: string;
  company: string;
  activeUsers: number;
  modulesBuilt: number;
  platformStatus: "Active" | "Inactive";
};

const mockData: PlatformData[] = [
  { id: "1", company: "Unilever", activeUsers: 4500, modulesBuilt: 24, platformStatus: "Active" },
  { id: "2", company: "Retail Corp NL", activeUsers: 4500, modulesBuilt: 24, platformStatus: "Active" },
  { id: "3", company: "Retail Corp NL", activeUsers: 4500, modulesBuilt: 24, platformStatus: "Active" },
  { id: "4", company: "Retail Corp NL", activeUsers: 4500, modulesBuilt: 24, platformStatus: "Active" },
  { id: "5", company: "Retail Corp NL", activeUsers: 4500, modulesBuilt: 24, platformStatus: "Active" },
  { id: "6", company: "Retail Corp NL", activeUsers: 4500, modulesBuilt: 24, platformStatus: "Active" },
  { id: "7", company: "Retail Corp NL", activeUsers: 4500, modulesBuilt: 24, platformStatus: "Active" },
];

export default function SuperAdminDashboardPage() {
  const columns = useMemo<ColumnDef<PlatformData>[]>(() => [
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => <span className="text-foreground">{row.original.company}</span>,
    },
    {
      accessorKey: "activeUsers",
      header: () => <div className="text-center">Active Users</div>,
      cell: ({ row }) => <div className="text-center text-muted-foreground">{row.original.activeUsers}</div>,
    },
    {
      accessorKey: "modulesBuilt",
      header: () => <div className="text-center">Modules Built</div>,
      cell: ({ row }) => <div className="text-center text-muted-foreground">{row.original.modulesBuilt}</div>,
    },
    {
      accessorKey: "platformStatus",
      header: () => <div className="text-right pr-4">Platform Status</div>,
      cell: ({ row }) => (
        <div className="text-right pr-4">
          <Badge variant={row.original.platformStatus === "Active" ? "active" : "destructive"}>
            {row.original.platformStatus}
          </Badge>
        </div>
      ),
    },
  ], []);

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader 
          title="ActInc Platform Overview" 
          description="Real-time overview of global analytics, client metrics, and platform-wide training statistics" 
        />
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-secondary/10 border border-secondary/20 rounded-sm p-6 flex flex-col justify-between h-32">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Client Companies</h3>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-bold text-foreground">24</span>
              <span className="text-sm text-muted-foreground">companies</span>
            </div>
          </div>
          
          <div className="bg-primary/10 border border-primary/20 rounded-sm p-6 flex flex-col justify-between h-32">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Employees</h3>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-bold text-foreground">18,250</span>
            </div>
          </div>
          
          <div className="bg-secondary/30 border border-secondary/40 rounded-sm p-6 flex flex-col justify-between h-32">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Modules</h3>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-bold text-foreground">350</span>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card border rounded-md p-4 shadow-sm">
          <DataTable
            columns={columns}
            data={mockData}
          />
        </div>
      </DashboardPageLayout>
    </div>
  );
}
