"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/custom/data-table";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import { UserDetailModal } from "@/components/company/users/UserDetailModal";

export type UserData = {
  id: string;
  name: string;
  emailOrId: string;
  points: number;
};

const mockUsers: UserData[] = [
  {
    id: "1",
    name: "Nm Sujon",
    emailOrId: "Nsujon8@gmail.com",
    points: 95,
  },
  {
    id: "2",
    name: "Nm Sujon",
    emailOrId: "Nsujon8@gmail.com",
    points: 95,
  },
  {
    id: "3",
    name: "Nm Sujon",
    emailOrId: "#12245844",
    points: 95,
  },
];

export default function CompanyUsersPage() {
  const columns = useMemo<ColumnDef<UserData>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        meta: { headerClassName: "bg-secondary/40 text-foreground font-semibold" },
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-border shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                {row.original.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-muted-foreground">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "emailOrId",
        header: "Email / ID",
        meta: { headerClassName: "bg-secondary/40 text-foreground font-semibold" },
        cell: ({ row }) => (
          <span className="text-muted-foreground font-medium">{row.original.emailOrId}</span>
        ),
      },
      {
        accessorKey: "points",
        header: "Points",
        meta: { headerClassName: "bg-secondary/40 text-foreground font-semibold" },
        cell: ({ row }) => (
          <span className="text-muted-foreground font-medium">{row.original.points}</span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Action</div>,
        meta: { headerClassName: "bg-secondary/40 text-foreground font-semibold" },
        cell: ({ row }) => (
          <div className="text-right">
           <UserDetailModal user={row.original}/>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader 
          title="User Management" 
          description="View and manage all enrolled users within your company."
        />
        
        <div className="bg-card border border-border shadow-sm rounded-sm p-4">
          <DataTable columns={columns} data={mockUsers} />
        </div>
      </DashboardPageLayout>
    </div>
  );
}
