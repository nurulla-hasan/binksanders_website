import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Copy, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CoursePage() {
  const courses = [
    {
      title: "Workplace Health & Safety Basics",
      steps: 6,
      employees: "1,240",
    },
    {
      title: "Emergency Evacuation & Fire Drill",
      steps: 6,
      employees: "1,240",
    },
    {
      title: "Cyber Security",
      steps: 6,
      employees: "1,240",
    },
  ];

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader 
          title="Module Directory" 
          description="Manage, edit, or create custom learning paths for your employees." 
        >
          <Link href="/super-admin/course/create">
            <Button>
              <Plus /> Create Module
            </Button>
          </Link>
        </DashboardHeader>
        
        <div className="flex flex-col gap-4">
          {courses.map((course, index) => (
            <Card key={index} className="bg-secondary/30 border-secondary/50 shadow-none rounded-md hover:bg-secondary/20 transition-colors">
              <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="font-semibold text-foreground text-lg tracking-tight mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {course.steps} active steps <span className="mx-1 text-muted-foreground/60">|</span> {course.employees} Employees enrolled
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button size="sm" className="flex-1 sm:flex-none">
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                    <Copy className="h-4 w-4 text-muted-foreground" /> <span className="text-muted-foreground">Duplicate</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                    <Trash2 className="h-4 w-4 text-muted-foreground" /> <span className="text-muted-foreground">Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardPageLayout>
    </div>
  );
}
