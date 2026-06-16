"use client";

import { useMemo } from "react";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/custom/data-table";
import { AddAdminModal } from "@/components/company/make-admin/AddAdminModal";

export type AdminData = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

const mockData: AdminData[] = [
  {
    id: "1",
    name: "Nm Sujon",
    email: "Nsujon8@gmail.com",
    avatarUrl: "/avatars/01.png",
  },
  {
    id: "2",
    name: "Nm Sujon",
    email: "Nsujon8@gmail.com",
    avatarUrl: "/avatars/02.png",
  },
  {
    id: "3",
    name: "Nm Sujon",
    email: "Nsujon8@gmail.com",
    avatarUrl: "/avatars/03.png",
  },
  {
    id: "4",
    name: "Nm Sujon",
    email: "Nsujon8@gmail.com",
    avatarUrl: "/avatars/04.png",
  },
];

export default function MakeAdminPage() {
  const columns = useMemo<ColumnDef<AdminData>[]>(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm">
              <AvatarImage src={row.original.avatarUrl} alt={row.original.name} className="object-cover" />
              <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-muted-foreground">{row.original.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return <div className="text-muted-foreground">{row.original.email}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right pr-4">Action</div>,
      cell: () => {
        return (
          <div className="flex items-center justify-end gap-2 pr-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 />
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
          title="Admin" 
          description="Manage administrators and control system access."
        >
          <AddAdminModal>
            <Button>
              Make Admin
            </Button>
          </AddAdminModal>
        </DashboardHeader>

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
