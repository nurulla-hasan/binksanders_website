import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardStats() {
  const stats = [
    { 
      title: "ACTIVE PARTICIPANTS", 
      value: "1,240", 
      suffix: "Employees",
      bgColor: "bg-secondary/20",
      borderColor: "border-secondary/40"
    },
    { 
      title: "OVERALL SCORE", 
      value: "84%", 
      suffix: "",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30"
    },
    { 
      title: "ORGANIZATION GRADE", 
      value: "8.4", 
      suffix: "",
      bgColor: "bg-muted/50",
      borderColor: "border-border"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className={`${stat.bgColor} ${stat.borderColor} shadow-none`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline gap-2">
            <div className="text-4xl font-bold font-heading">{stat.value}</div>
            {stat.suffix && (
              <span className="text-xs font-medium text-muted-foreground">{stat.suffix}</span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
