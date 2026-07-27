import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TrainingCreateForm } from "@/components/super-admin/training/TrainingCreateForm";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";

export default async function CreateTrainingPage() {
  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Create Training"
          description="Create a training and choose its login method. Assign it to a company team after creation."
        >
          <Button asChild variant="ghost">
            <Link href="/super-admin/training">
              <ArrowLeft /> Back
            </Link>
          </Button>
        </DashboardHeader>

        <div className="rounded-md border border-border bg-card p-5 shadow-sm">
          <TrainingCreateForm />
        </div>
      </DashboardPageLayout>
    </div>
  );
}
