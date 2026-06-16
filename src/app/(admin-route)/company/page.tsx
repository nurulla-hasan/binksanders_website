import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DashboardStats } from "@/components/super-admin/dashboard/DashboardStats";
import { BehavioralChart } from "@/components/super-admin/dashboard/BehavioralChart";
import { Leaderboard } from "@/components/super-admin/dashboard/Leaderboard";

export default function AdminDashboardPage() {
  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader 
          title="Welcome back, Admin" 
          description="Real-time overview of your organization's" 
        />
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
          <BehavioralChart />
          <Leaderboard />
        </div>
      </DashboardPageLayout>
    </div>
  );
}
