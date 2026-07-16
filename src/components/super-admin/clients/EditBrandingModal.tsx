"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Company, CompanyBrandingData } from "@/lib/types/company.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { updateCompanyBranding } from "@/services/company.service";

export function EditBrandingModal({ company }: { company: Company }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [logo, setLogo] = useState<File>();
  const [video, setVideo] = useState<File>();
  const [form, setForm] = useState<CompanyBrandingData>({
    primaryColor: company.branding.primaryColor,
    secondaryColor: company.branding.secondaryColor,
    videoTitle: company.branding.videoTitle,
    videoDescription: company.branding.videoDescription,
    presenterName: company.branding.presenterName,
    presenterDesignation: company.branding.presenterDesignation,
  });

  const updateField = (field: keyof CompanyBrandingData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    try {
      const response = await updateCompanyBranding(company._id, {
        data: form,
        logo,
        video,
      });
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Company branding updated");
      setIsOpen(false);
      setLogo(undefined);
      setVideo(undefined);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to update branding",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ModalWrapper
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Edit Branding"
      description="Update the client's colors, logo, and onboarding video."
      actionTrigger={
        <Button type="button" variant="outline">
          <Palette /> Branding
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="primaryColor">Primary Color</FieldLabel>
              <Input
                id="primaryColor"
                type="color"
                value={form.primaryColor || "#000000"}
                onChange={(event) => updateField("primaryColor", event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="secondaryColor">Secondary Color</FieldLabel>
              <Input
                id="secondaryColor"
                type="color"
                value={form.secondaryColor || "#000000"}
                onChange={(event) => updateField("secondaryColor", event.target.value)}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="videoTitle">Video Title</FieldLabel>
            <Input id="videoTitle" value={form.videoTitle || ""} onChange={(event) => updateField("videoTitle", event.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="videoDescription">Video Description</FieldLabel>
            <Input id="videoDescription" value={form.videoDescription || ""} onChange={(event) => updateField("videoDescription", event.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="presenterName">Presenter Name</FieldLabel>
              <Input id="presenterName" value={form.presenterName || ""} onChange={(event) => updateField("presenterName", event.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="presenterDesignation">Designation</FieldLabel>
              <Input id="presenterDesignation" value={form.presenterDesignation || ""} onChange={(event) => updateField("presenterDesignation", event.target.value)} />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="companyLogo">Logo</FieldLabel>
            <Input id="companyLogo" type="file" accept="image/*" onChange={(event) => setLogo(event.target.files?.[0])} />
          </Field>
          <Field>
            <FieldLabel htmlFor="companyVideo">Onboarding Video</FieldLabel>
            <Input id="companyVideo" type="file" accept="video/*" onChange={(event) => setVideo(event.target.files?.[0])} />
          </Field>
        </FieldGroup>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Branding"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
