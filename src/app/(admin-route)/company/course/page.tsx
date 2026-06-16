"use client";

import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import Link from "next/link";

const mockCourses = [
  {
    id: "1",
    title: "Workplace Health & Safety Basics",
    activeSteps: 6,
    enrolledEmployees: 1240,
  },
  {
    id: "2",
    title: "Emergency Evacuation & Fire Drill",
    activeSteps: 6,
    enrolledEmployees: 1240,
  },
  {
    id: "3",
    title: "Cyber Security",
    activeSteps: 6,
    enrolledEmployees: 1240,
  },
];

export default function CompanyCourseDirectoryPage() {
  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Course Directory"
          description="Manage, edit, or create custom learning paths for your employees."
        />

        <div className="flex flex-col gap-4">
          {mockCourses.map((course) => (
            <Link
              key={course.id}
              href={`/company/course/${course.id}`} // Assuming future linking
              className="group block border border-secondary/30 bg-secondary/20 rounded-sm p-5 transition-colors hover:bg-secondary/10"
            >
              <h3 className="text-lg font-bold text-foreground mb-1">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {course.activeSteps} active steps | {course.enrolledEmployees.toLocaleString()} Employees enrolled
              </p>
            </Link>
          ))}
        </div>
      </DashboardPageLayout>
    </div>
  );
}
