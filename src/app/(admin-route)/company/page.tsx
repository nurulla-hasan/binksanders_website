import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DashboardStats } from "@/components/super-admin/dashboard/DashboardStats";
import { BehavioralChart } from "@/components/super-admin/dashboard/BehavioralChart";
import { Leaderboard } from "@/components/super-admin/dashboard/Leaderboard";
import { getMyProfile } from "@/services/user.service";
import { getCompanyAnalytics } from "@/services/company.service";

export default async function AdminDashboardPage() {
  const profileResponse = await getMyProfile();
  const companyId = profileResponse.success ? profileResponse.data._id : "";
  
  let analytics = null;
  if (companyId) {
    const analyticsResponse = await getCompanyAnalytics(companyId);
    if (analyticsResponse.success) {
      analytics = analyticsResponse.data;
    }
  }

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        {/* <DashboardHeader 
          title="Welcome back, Company" 
          description="Real-time overview of your organization's" 
        /> */}
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-125">
          <BehavioralChart 
            data={analytics?.barChart?.chartData || []} 
            averageIncrease={analytics?.barChart?.averageIncreasePercentage || 0}
          />
          <Leaderboard />
        </div>
      </DashboardPageLayout>
    </div>
  );
}
