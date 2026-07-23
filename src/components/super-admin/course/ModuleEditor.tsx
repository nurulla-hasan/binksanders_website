/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
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
        (module?.questions.map((question) => {
          if (question.type === "MCQ") {
            const options = question.options || [];
            return {
              ...question,
              options:
                options.length >= 4
                  ? options
                  : [...options, ...Array(4 - options.length).fill("")],
            };
          }

          if (question.type === "Ordering") {
            const items = question.items || [];
            return {
              ...question,
              items:
                items.length >= 4
                  ? items
                  : [...items, ...Array(4 - items.length).fill("")],
            };
          }

          if (question.type === "Chat Scenario") {
            const options = question.options || [];
            return {
              ...question,
              options:
                options.length >= 2
                  ? options
                  : [...options, ...Array(2 - options.length).fill("")],
              correctAnswer: question.correctAnswer || "",
            };
          }

          return question;
        }) as CreateModuleFormValues["questions"]) || [],
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

  const onInvalid = (errors: FieldErrors<CreateModuleFormValues>) => {
    const findMessage = (value: unknown): string | undefined => {
      if (!value || typeof value !== "object") return undefined;
      if (
        "message" in value &&
        typeof (value as { message?: unknown }).message === "string"
      ) {
        return (value as { message: string }).message;
      }

      for (const nestedValue of Object.values(value)) {
        const message = findMessage(nestedValue);
        if (message) return message;
      }

      return undefined;
    };

    ErrorToast(
      findMessage(errors) || "Please complete all required module fields",
    );
  };

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit, onInvalid)}>
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
