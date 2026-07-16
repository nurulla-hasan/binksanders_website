"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import TiptapEditor from "@/components/ui/custom/tiptap-editor";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { upsertPrivacy, upsertTerms } from "@/services/cms.service";

export function CmsEditor({
  type,
  title,
  description,
  initialContent,
  placeholder,
}: {
  type: "privacy" | "terms";
  title: string;
  description: string;
  initialContent: string;
  placeholder: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) {
      ErrorToast(`${title} content is required`);
      return;
    }

    setIsSaving(true);

    try {
      const response =
        type === "privacy"
          ? await upsertPrivacy({ privacyPolicy: content })
          : await upsertTerms({ termsCondition: content });

      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || `${title} saved successfully`);
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : `Unable to save ${title.toLowerCase()}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader title={title} description={description}>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            <Save />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DashboardHeader>

        <div className="rounded-md border border-border bg-card p-1 shadow-sm">
          <TiptapEditor
            value={content}
            onChange={setContent}
            placeholder={placeholder}
          />
        </div>
      </DashboardPageLayout>
    </div>
  );
}
