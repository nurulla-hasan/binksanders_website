"use client";

import { useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import TiptapEditor from "@/components/ui/custom/tiptap-editor";

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState<string>(
    "<h2>Privacy Policy</h2><p>Start writing your privacy policy here...</p>"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate an API call
    setTimeout(() => {
      console.log("Saved content:", content);
      setIsSaving(false);
      setSaved(true);
      
      // Hide the success message after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Privacy Policy"
          description="Manage and update the privacy policy for your platform."
        >
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm font-medium text-success flex items-center gap-1.5 animate-in fade-in slide-in-from-right-4">
                <CheckCircle2 className="w-4 h-4" />
                Saved Successfully
              </span>
            )}
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="gap-2 min-w-[140px]"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DashboardHeader>

        <div className="bg-card border border-border shadow-sm rounded-md p-1">
          <TiptapEditor
            value={content}
            onChange={setContent}
            placeholder="Type your privacy policy here..."
          />
        </div>
      </DashboardPageLayout>
    </div>
  );
}
