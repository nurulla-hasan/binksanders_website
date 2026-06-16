/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { ModuleBasicInfo } from "@/components/super-admin/course/ModuleBasicInfo";
import { QuestionnaireSection } from "@/components/super-admin/course/QuestionnaireSection";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createModuleSchema, CreateModuleFormValues } from "@/lib/validations/course";

export default function CreateModulePage() {
  const methods = useForm<CreateModuleFormValues>({
    resolver: zodResolver(createModuleSchema as any),
    defaultValues: {
      title: "",
      description: "",
      questions: [],
    },
  });

  const onSubmit = (data: CreateModuleFormValues) => {
    console.log("Form Submitted:", data);
  };

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Custom Header for Create Module */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link href="/super-admin/course">
                <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Directory</span>
                </Button>
              </Link>
              
              <Button type="submit" className="w-full sm:w-auto">
                <Upload />
                Publish Module
              </Button>
            </div>
            
            {/* Module Content Sections */}
            <div className="max-w-4xl space-y-6 mt-6">
              <ModuleBasicInfo />
              <QuestionnaireSection />
              
              {/* Future components will be added here */}
            </div>
          </form>
        </FormProvider>
      </DashboardPageLayout>
    </div>
  );
}
