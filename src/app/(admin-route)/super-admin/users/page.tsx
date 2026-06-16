"use client";

import { useMemo } from "react";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/custom/data-table";
import { Eye, Settings, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

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
      header: "Active Users",
      cell: ({ row }) => row.original.activeUsers

    },
    {
      accessorKey: "assignedModules",
      header: "Assigned Modules",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.assignedModules}</span>,
    },
    {
      accessorKey: "platformStatus",
      header: "Platform Status",
      cell: ({ row }) => {
        const isActive = row.original.platformStatus === "Active";
        return (
          <div>
            <Badge variant={isActive ? "active" : "destructive"}>
              {row.original.platformStatus}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => {
        // Mocking the second row's red icon to match the screenshot
        const isInactiveToggle = row.index === 1; 
        return (
          <div className="flex items-center justify-end gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/super-admin/users/${row.original.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>View User</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Manage Settings</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className={`h-8 w-8 ${isInactiveToggle ? 'text-destructive hover:text-destructive hover:bg-destructive/10' : 'text-success hover:text-success hover:bg-success/10'}`}>
                  {isInactiveToggle ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isInactiveToggle ? 'Deactivate User' : 'Activate User'}</TooltipContent>
            </Tooltip>
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
