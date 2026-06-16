import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, BarChart3, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Total Users", value: "1,234", icon: Users, color: "text-blue-500" },
    { title: "Active Modules", value: "8", icon: FileText, color: "text-pink-500" },
    { title: "Total Responses", value: "8,942", icon: BarChart3, color: "text-green-500" },
    { title: "Completion Rate", value: "76%", icon: TrendingUp, color: "text-orange-500" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-heading tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening across your modules today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full text-muted-foreground">
            Activity chart will appear here
          </CardContent>
        </Card>
        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle>Module Performance</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full text-muted-foreground">
            Performance metrics will appear here
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
