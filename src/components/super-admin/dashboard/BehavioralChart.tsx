"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { name: "Teamwork", baseline: 45, followUp: 65 },
  { name: "Communication", baseline: 50, followUp: 75 },
  { name: "Leadership", baseline: 35, followUp: 60 },
  { name: "Social Safety", baseline: 50, followUp: 80 },
  { name: "Adaptability", baseline: 55, followUp: 85 },
  { name: "Problem Solving", baseline: 40, followUp: 70 },
];

const chartConfig = {
  baseline: {
    label: "Baseline",
    color: "var(--secondary)",
  },
  followUp: {
    label: "Follow-up",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function BehavioralChart() {
  return (
    <Card className="col-span-1 lg:col-span-2 bg-primary/5 border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <CardTitle className="text-lg font-bold font-heading uppercase tracking-wide">
          BEHAVIORAL CHANGE OVER TIME
        </CardTitle>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary rounded-sm" />
            <span className="text-muted-foreground">Baseline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-sm" />
            <span className="text-muted-foreground">Follow-up</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={0}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis hide domain={[0, 100]} />
              <ChartTooltip cursor={{ fill: "transparent" }} content={<ChartTooltipContent />} />
              <Bar dataKey="baseline" fill="var(--secondary)" radius={[2, 2, 0, 0]} barSize={24} />
              <Bar dataKey="followUp" fill="var(--primary)" radius={[2, 2, 0, 0]} barSize={24} />
            </BarChart>
          </ChartContainer>
        </div>
        
        <div className="mt-6 inline-block">
          <div className="bg-secondary/40 text-secondary-foreground px-3 py-1.5 rounded-sm text-sm font-medium border border-secondary/20">
            Average score increase: +22%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
