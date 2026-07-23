"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Video } from "lucide-react";
import { BrandingCompanySelect } from "@/components/super-admin/branding/BrandingCompanySelect";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Company, CompanyBrandingData, CompanyDropdownItem } from "@/lib/types/company.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { updateCompanyBranding } from "@/services/company.service";

export function BrandingForm({
  company,
  companies,
  selectedCompanyId,
}: {
  company: Company;
  companies: CompanyDropdownItem[];
  selectedCompanyId: string;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [logo, setLogo] = useState<File>();
  const [video, setVideo] = useState<File>();
  const [logoPreview, setLogoPreview] = useState(company.logo);
  const [videoPreview, setVideoPreview] = useState(company.branding.videoUrl);
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
      const response = await updateCompanyBranding(
        company._id,
        {
        data: form,
        logo,
        video,
        },
      );
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Branding updated successfully");
      setLogo(undefined);
      setVideo(undefined);
      router.push(`/super-admin/clients/${company._id}/settings`);
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to update branding");
    } finally {
      setIsPending(false);
    }
  };

  const handleLogoChange = (file?: File) => {
    setLogo(file);
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (file?: File) => {
    setVideo(file);
    if (file) setVideoPreview(URL.createObjectURL(file));
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-4xl flex-col gap-6 pb-12">
      <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-4 sm:flex-row sm:items-end sm:justify-between">
        <Field>
          <FieldLabel>Client Company</FieldLabel>
          <BrandingCompanySelect
            companies={companies}
            value={selectedCompanyId}
          />
        </Field>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Applying..." : "Apply Branding"}
        </Button>
      </div>

      <FieldSet className="rounded-md border border-border bg-card p-6 shadow-sm">
        <FieldLabel>Logo Configuration</FieldLabel>
        <FieldDescription>Upload the company logo displayed on its client portal.</FieldDescription>
        <Field>
          <FieldLabel htmlFor="brandingLogo">Upload Logo</FieldLabel>
          <label htmlFor="brandingLogo" className="flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-border bg-background">
            <Input id="brandingLogo" type="file" accept="image/*" className="sr-only" onChange={(event) => handleLogoChange(event.target.files?.[0])} />
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="Company logo preview" className="h-full w-full object-contain p-4" />
            ) : (
              <span className="flex items-center gap-2 text-sm text-muted-foreground"><ImageIcon /> Upload logo</span>
            )}
          </label>
        </Field>
      </FieldSet>

      <FieldSet className="rounded-md border border-border bg-card p-6 shadow-sm">
        <FieldLabel>Portal Colors</FieldLabel>
        <FieldDescription>Configure buttons, highlights, and progress colors.</FieldDescription>
        <FieldGroup className="grid gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="primaryBrandColor">Primary Brand Color</FieldLabel>
            <Input id="primaryBrandColor" type="color" value={form.primaryColor || "#000000"} onChange={(event) => updateField("primaryColor", event.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="secondaryBrandColor">Secondary Brand Color</FieldLabel>
            <Input id="secondaryBrandColor" type="color" value={form.secondaryColor || "#000000"} onChange={(event) => updateField("secondaryColor", event.target.value)} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="rounded-md border border-border bg-card p-6 shadow-sm">
        <FieldLabel>Welcome Video</FieldLabel>
        <FieldDescription>Configure the onboarding video shown to employees.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="brandingVideoTitle">Video Title</FieldLabel>
            <Input id="brandingVideoTitle" value={form.videoTitle || ""} onChange={(event) => updateField("videoTitle", event.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="brandingVideoDescription">Description</FieldLabel>
            <Textarea id="brandingVideoDescription" value={form.videoDescription || ""} onChange={(event) => updateField("videoDescription", event.target.value)} />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="brandingPresenter">Presenter Name</FieldLabel>
              <Input id="brandingPresenter" value={form.presenterName || ""} onChange={(event) => updateField("presenterName", event.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="brandingDesignation">Presenter Designation</FieldLabel>
              <Input id="brandingDesignation" value={form.presenterDesignation || ""} onChange={(event) => updateField("presenterDesignation", event.target.value)} />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="brandingVideo">Upload Video</FieldLabel>
            <label htmlFor="brandingVideo" className="flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-border bg-background">
              <Input id="brandingVideo" type="file" accept="video/*" className="sr-only" onChange={(event) => handleVideoChange(event.target.files?.[0])} />
              {videoPreview ? (
                <video src={videoPreview} controls className="h-full w-full object-contain" />
              ) : (
                <span className="flex items-center gap-2 text-sm text-muted-foreground"><Video /> Upload video</span>
              )}
            </label>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
