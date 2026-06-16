"use client";

import { Badge } from "@/components/ui/badge";

export function CompanyProfileCard() {
  return (
    <div className="bg-card border border-border shadow-sm overflow-hidden">
      <div className="bg-linear-to-r from-primary/5 via-primary/2 to-transparent px-8 py-6 flex flex-col sm:flex-row items-center gap-6">
        {/* Logo */}
        <div className="w-20 h-20 shrink-0 border-2 border-border flex items-center justify-center bg-background shadow-sm">
          <div className="text-center font-bold text-primary flex flex-col items-center justify-center">
            <span className="text-3xl leading-none block">U</span>
            <span className="text-xs mt-0.5 tracking-wide">Unilever</span>
          </div>
        </div>
        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Unilever
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Consumer Goods · 6,200 employees · Member since 2024
          </p>
        </div>
        {/* Status Badge */}
        <Badge variant="active">
          Active
        </Badge>
      </div>
    </div>
  );
}
