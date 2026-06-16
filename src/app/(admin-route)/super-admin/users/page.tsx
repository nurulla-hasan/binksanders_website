"use client";

import { useMemo } from "react";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/custom/data-table";
import { Eye, Settings, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ClientData = {
  id: string;
  company: string;
  email: string;
  activeUsers: number;
  assignedModules: number;
  platformStatus: "Active" | "Inactive";
};

const mockData: ClientData[] = [
  { id: "1", company: "Unilever", email: "actink@gmail.com", activeUsers: 4500, assignedModules: 5, platformStatus: "Active" },
  { id: "2", company: "Retail Corp NL", email: "corpk@gmail.com", activeUsers: 4500, assignedModules: 6, platformStatus: "Active" },
  { id: "3", company: "Retail Corp NL", email: "corpk@gmail.com", activeUsers: 4500, assignedModules: 2, platformStatus: "Active" },
  { id: "4", company: "Retail Corp NL", email: "corpk@gmail.com", activeUsers: 4500, assignedModules: 10, platformStatus: "Active" },
  { id: "5", company: "Retail Corp NL", email: "corpk@gmail.com", activeUsers: 4500, assignedModules: 1, platformStatus: "Active" },
  { id: "6", company: "Retail Corp NL", email: "corpk@gmail.com", activeUsers: 4500, assignedModules: 4, platformStatus: "Active" },
  { id: "7", company: "Retail Corp NL", email: "corpk@gmail.com", activeUsers: 4500, assignedModules: 1, platformStatus: "Active" },
];

export default function ClientPage() {
  const columns = useMemo<ColumnDef<ClientData>[]>(() => [
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => <span className="font-medium text-muted-foreground">{row.original.company}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
    },
    {
      accessorKey: "activeUsers",
      header: () => <div className="text-center">Active Users</div>,
      cell: ({ row }) => <div className="text-center text-muted-foreground">{row.original.activeUsers}</div>,
    },
    {
      accessorKey: "assignedModules",
      header: () => <div className="text-center">Assigned Modules</div>,
      cell: ({ row }) => <div className="text-center text-muted-foreground">{row.original.assignedModules}</div>,
    },
    {
      accessorKey: "platformStatus",
      header: () => <div className="text-center">Platform Status</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium">
          <span className={row.original.platformStatus === "Active" ? "text-success" : "text-destructive"}>
            {row.original.platformStatus}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        // Mocking the second row's red icon to match the screenshot
        const isInactiveToggle = row.index === 1; 
        return (
          <div className="flex items-center justify-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className={`h-8 w-8 ${isInactiveToggle ? 'text-destructive' : 'text-success'}`}>
              {isInactiveToggle ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
            </Button>
          </div>
        );
      },
    },
  ], []);

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Client Management"
          description="View active client companies, monitor total enrolled employees, and manage corporate portals."
        />

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
