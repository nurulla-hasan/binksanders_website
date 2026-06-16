"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import {
  CompanyProfileCard,
  StatCards,
  BehavioralChangeChart,
  LocationPerformanceTable,
  AssignedModulesCompliance,
  FooterActions,
} from "@/components/super-admin/user";

export default function CompanyDetailsPage() {
  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        {/* ── Page Header ── */}
        <DashboardHeader
          title="Company Details"
          description="Detailed overview of company performance and compliance"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
            className="self-start sm:self-auto"
          >
            <ArrowLeft />
            Back to Users
          </Button>
        </DashboardHeader>

        <CompanyProfileCard />
        <StatCards />
        <BehavioralChangeChart />

        {/* ── Two Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LocationPerformanceTable />
          <AssignedModulesCompliance />
        </div>

        <FooterActions />
      </DashboardPageLayout>
    </div>
  );
}
