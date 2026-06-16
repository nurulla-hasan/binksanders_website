"use client";

import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "Social Safety", baseline: 60, followUp: 90 },
  { name: "Workplace Respect", baseline: 55, followUp: 85 },
  { name: "Inclusion & Equity", baseline: 65, followUp: 95 },
  { name: "Well-being", baseline: 70, followUp: 92 },
  { name: "Team Collaboration", baseline: 50, followUp: 88 },
  { name: "Conflict Resolution", baseline: 45, followUp: 78 },
  { name: "Leadership Skills", baseline: 62, followUp: 85 },
];

export function BehavioralChangeChart() {
  return (
    <div className="bg-card border border-border shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-lg font-bold font-heading text-foreground">
            Behavioral Change Over Time
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Baseline vs Follow-up comparison across key metrics
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-secondary" />
            <span className="text-sm font-medium text-muted-foreground">
              Baseline
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Follow-up
            </span>
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barGap={8}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 13, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 12 }}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip cursor={{ fill: "transparent" }} />
            <Bar
              dataKey="baseline"
              fill="var(--secondary)"
              radius={[4, 4, 0, 0]}
              barSize={36}
            />
            <Bar
              dataKey="followUp"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              barSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-border">
        <Badge className="bg-secondary/15 text-secondary-foreground hover:bg-secondary/25 font-semibold border-0 px-4 py-1.5 text-xs">
          Average score increase: +22%
        </Badge>
        <Badge
          variant="outline"
          className="text-muted-foreground font-normal border-border text-xs px-4 py-1.5"
        >
          Based on 4 assessments
        </Badge>
      </div>
    </div>
  );
}
