/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import type { LearningModule, ModuleData } from "@/lib/types/module.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import {
  createModuleSchema,
  type CreateModuleFormValues,
} from "@/lib/validations/course";
import { createModule, updateModule } from "@/services/module.service";
import { ModuleBasicInfo } from "./ModuleBasicInfo";
import { QuestionnaireSection } from "./QuestionnaireSection";

export function ModuleEditor({ module }: { module?: LearningModule }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const isEditing = Boolean(module);
  const methods = useForm<CreateModuleFormValues>({
    resolver: zodResolver(createModuleSchema as any),
    defaultValues: {
      title: module?.title || "",
      description: module?.description || "",
      questions:
        (module?.questions as CreateModuleFormValues["questions"]) || [],
    },
  });

  const onSubmit = async (values: CreateModuleFormValues) => {
    if (!isEditing && !values.thumbnail) {
      ErrorToast("Thumbnail image is required");
      return;
    }

    const data: ModuleData = {
      title: values.title,
      description: values.description,
      questions: values.questions,
    };

    setIsPending(true);

    try {
      const response = module
        ? await updateModule(module._id, data)
        : await createModule({
            data,
            thumbnailImage: values.thumbnail as File,
          });

      if (!response.success) throw new Error(response.message);
      SuccessToast(
        response.message ||
          (isEditing ? "Module updated successfully" : "Module created successfully"),
      );
      router.replace("/super-admin/course");
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error
          ? error.message
          : `Unable to ${isEditing ? "update" : "create"} module`,
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button asChild variant="ghost">
                <Link href="/super-admin/course">
                  <ArrowLeft /> Back to Directory
                </Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isEditing ? <Save /> : <Upload />}
                {isPending
                  ? "Saving..."
                  : isEditing
                    ? "Save Module"
                    : "Create Module"}
              </Button>
            </div>

            <div className="mt-6 max-w-4xl space-y-6">
              <ModuleBasicInfo
                existingThumbnail={module?.thumbnailImage}
                allowThumbnail={!isEditing}
              />
              <QuestionnaireSection />
            </div>
          </form>
        </FormProvider>
      </DashboardPageLayout>
    </div>
  );
}
