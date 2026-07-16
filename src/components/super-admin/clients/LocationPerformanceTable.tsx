import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/custom/data-table";
import { ColumnDef } from "@tanstack/react-table";

type LocationData = {
  team: string;
  activeUser: number;
  progress: number;
  avgScore: string;
};

const mockLocations: LocationData[] = [
  { team: "Utrecht", activeUser: 15, progress: 95, avgScore: "88%" },
  { team: "Hilversum Store", activeUser: 15, progress: 95, avgScore: "88%" },
  { team: "Team 05", activeUser: 15, progress: 88, avgScore: "85%" },
  { team: "Amsterdam Office", activeUser: 28, progress: 62, avgScore: "76%" },
  { team: "Rotterdam Branch", activeUser: 18, progress: 45, avgScore: "91%" },
  { team: "Team 05", activeUser: 15, progress: 88, avgScore: "85%" },
];

const columns: ColumnDef<LocationData>[] = [
  {
    accessorKey: "team",
    header: "Location / Team",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.team}</span>
    ),
  },
  {
    accessorKey: "activeUser",
    header: () => <div className="text-center">Active</div>,
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground">
        {row.original.activeUser}
      </div>
    ),
  },
  {
    accessorKey: "progress",
    header: () => <div className="text-center">Progress</div>,
    cell: ({ row }) => {
      const progress = row.original.progress;
      const colorClass =
        progress >= 80
          ? "text-success"
          : progress >= 50
            ? "text-amber-500"
            : "text-destructive";
      const bgColorClass =
        progress >= 80
          ? "bg-success"
          : progress >= 50
            ? "bg-amber-500"
            : "bg-destructive";

      return (
        <div className="flex justify-center items-center">
          <span className="inline-flex items-center gap-1.5 text-sm">
            <span className={`font-semibold ${colorClass}`}>{progress}%</span>
            <div className="w-16 h-1.5 bg-muted overflow-hidden hidden sm:inline-block">
              <div
                className={`h-full transition-all ${bgColorClass}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "avgScore",
    header: () => <div className="text-center">Avg Score</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Badge
          variant="secondary"
          className="font-semibold border-0 text-xs px-2.5 py-0.5"
        >
          {row.original.avgScore}
        </Badge>
      </div>
    ),
  },
];

export function LocationPerformanceTable() {
  return (
    <div className="bg-card border border-border shadow-sm overflow-hidden rounded-md">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-foreground">Location & Performance</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1">
          {mockLocations.length} locations
        </span>
      </div>
      <div className="p-4">
        <DataTable columns={columns} data={mockLocations} />
      </div>
    </div>
  );
}
