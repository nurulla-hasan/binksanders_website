"use client";

import { useMemo } from "react";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/custom/data-table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Download, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GenerateQRModal } from "@/components/super-admin/location-performance/GenerateQRModal";

export type AccessQRData = {
  id: string;
  company: string;
  location: string;
  linkedCourse: string;
  loginMethod: string;
  password?: string;
};

const tableData: AccessQRData[] = [
  { id: "1", company: "Unilever", location: "Utrecht", linkedCourse: "Social Safety", loginMethod: "Employ ID", password: "1223" },
  { id: "2", company: "Retail Corp", location: "Utrecht", linkedCourse: "Social Safety", loginMethod: "Anonymous" },
  { id: "3", company: "Hema", location: "Utrecht", linkedCourse: "Social Safety", loginMethod: "Anonymous" },
];

export default function AccessQRManagementPage() {
  const columns = useMemo<ColumnDef<AccessQRData>[]>(() => [
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => <div className="py-2 text-muted-foreground">{row.original.company}</div>,
    },
    {
      accessorKey: "location",
      header: "Location / Team",
      cell: ({ row }) => <div className="text-muted-foreground">{row.original.location}</div>,
    },
    {
      accessorKey: "linkedCourse",
      header: "Linked Course",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-normal">
          {row.original.linkedCourse}
        </Badge>
      ),
    },
    {
      accessorKey: "loginMethod",
      header: "Log In Method",
      cell: ({ row }) => <div className="text-muted-foreground">{row.original.loginMethod}</div>,
    },
    {
      accessorKey: "password",
      header: "Password",
      cell: ({ row }) => <div className="text-muted-foreground">{row.original.password || "-"}</div>,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: () => {
        return (
          <div className="flex items-center justify-end gap-2 text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy Credentials</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download QR Code</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10">
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Details</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Entry</TooltipContent>
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
          title="Access & QR Management" 
          description="Assign a location or team to a client company and generate their unique training QR code"
        >
          <div className="flex items-center gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unilever">Unilever</SelectItem>
                <SelectItem value="retail">Retail Corp</SelectItem>
                <SelectItem value="hema">Hema</SelectItem>
              </SelectContent>
            </Select>
            <GenerateQRModal />
          </div>
        </DashboardHeader>
        
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
