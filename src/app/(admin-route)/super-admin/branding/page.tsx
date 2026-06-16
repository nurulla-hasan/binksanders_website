/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel, FieldGroup, FieldSet, FieldDescription, FieldError } from "@/components/ui/field";
import { Image as ImageIcon, Video } from "lucide-react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandingSchema, BrandingFormValues } from "@/lib/validations/branding";

export default function ClientBrandingPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const methods = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema as any),
    defaultValues: {
      company: "",
      logo: null,
      primaryBrandColor: "",
      secondaryBrandColor: "",
      videoTitle: "",
      videoDescription: "",
      presenterName: "",
      presenterDesignation: "",
      welcomeVideo: null,
    },
  });

  const { register, handleSubmit, setValue, control, formState: { errors } } = methods;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setValue("logo", file, { shouldValidate: true });
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
      setValue("welcomeVideo", file, { shouldValidate: true });
    }
  };

  const onSubmit = (data: BrandingFormValues) => {
    console.log("Branding Settings Submitted:", data);
  };

  return (
    <DashboardPageLayout>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 animate-fadeIn pb-12">
          {/* Header Section */}
          <DashboardHeader
            title="Client Branding Settings"
            description="Configure custom logos, brand colors, and onboarding videos for registered client portals"
          >
            <div className="flex flex-col gap-1">
              <Controller
                control={control}
                name="company"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unilever">Unilever</SelectItem>
                      <SelectItem value="acme">Acme Inc</SelectItem>
                      <SelectItem value="stark">Stark Industries</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.company]} />
            </div>
            <Button type="submit">
              Apply Branding
            </Button>
          </DashboardHeader>

          {/* Branding Configuration Sections */}
          <FieldGroup className="max-w-4xl">
          
            {/* Logo Configuration Block */}
            <FieldSet className="bg-primary/5 border border-primary/20 rounded-md p-6 shadow-sm">
              <FieldLabel className="text-base font-semibold">Logo Configuration</FieldLabel>
              <FieldDescription>
                Upload your company logo. It will be displayed alongside the ActInc logo on the start screen
              </FieldDescription>
              
              <FieldGroup>
                <Field data-invalid={!!errors.logo}>
                  <FieldLabel>Upload Logo</FieldLabel>
                  <label className="relative border-2 border-dashed border-primary/40 rounded-md h-40 flex items-center justify-center bg-background/50 hover:bg-background cursor-pointer transition-colors w-full overflow-hidden">
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                    {logoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-4" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-5 w-5" />
                          <span className="text-sm font-medium">Upload here..</span>
                        </div>
                      </div>
                    )}
                  </label>
                  <FieldError errors={[errors.logo]} />
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* Portal Colors Block */}
            <FieldSet className="bg-secondary/10 border border-secondary/20 rounded-md p-6 shadow-sm">
              <FieldLabel className="text-base font-semibold">Portal Colors</FieldLabel>
              <FieldDescription>
                Define the primary brand colors for buttons, progress bars, and active highlights.
              </FieldDescription>
              
              <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field data-invalid={!!errors.primaryBrandColor}>
                  <FieldLabel>Primary Brand Color</FieldLabel>
                  <Input placeholder="#4564446" {...register("primaryBrandColor")} />
                  <FieldError errors={[errors.primaryBrandColor]} />
                </Field>
                <Field data-invalid={!!errors.secondaryBrandColor}>
                  <FieldLabel>Secondary Brand Color</FieldLabel>
                  <Input placeholder="#4564446" {...register("secondaryBrandColor")} />
                  <FieldError errors={[errors.secondaryBrandColor]} />
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* Welcome Video Block */}
            <FieldSet className="bg-primary/5 border border-primary/20 rounded-md p-6 shadow-sm">
              <FieldLabel className="text-base font-semibold">Welcome Video (Onboarding)</FieldLabel>
              <FieldDescription>
                Upload a short welcome video (CEO or Trainer intro) to be shown once to employees on their first login
              </FieldDescription>

              <FieldGroup>
                <Field data-invalid={!!errors.videoTitle}>
                  <FieldLabel>Video Title</FieldLabel>
                  <Input placeholder="Type here.." {...register("videoTitle")} />
                  <FieldError errors={[errors.videoTitle]} />
                </Field>

                <Field data-invalid={!!errors.videoDescription}>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea placeholder="Type here.." className="resize-none h-20" {...register("videoDescription")} />
                  <FieldError errors={[errors.videoDescription]} />
                </Field>

                <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field data-invalid={!!errors.presenterName}>
                    <FieldLabel>Presenter Name</FieldLabel>
                    <Input placeholder="Type here.." {...register("presenterName")} />
                    <FieldError errors={[errors.presenterName]} />
                  </Field>
                  <Field data-invalid={!!errors.presenterDesignation}>
                    <FieldLabel>Presenter Designation</FieldLabel>
                    <Input placeholder="Type here.." {...register("presenterDesignation")} />
                    <FieldError errors={[errors.presenterDesignation]} />
                  </Field>
                </FieldGroup>

                <Field data-invalid={!!errors.welcomeVideo}>
                  <FieldLabel>Upload Video</FieldLabel>
                  <label className="relative border-2 border-dashed border-primary/40 rounded-md h-48 flex items-center justify-center bg-background/50 hover:bg-background cursor-pointer transition-colors w-full overflow-hidden">
                    <input type="file" className="hidden" accept="video/*" onChange={handleVideoChange} />
                    {videoPreview ? (
                      <video src={videoPreview} controls className="w-full h-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Video className="h-5 w-5" />
                          <span className="text-sm font-medium">Upload video here..</span>
                        </div>
                      </div>
                    )}
                  </label>
                  <FieldError errors={[errors.welcomeVideo]} />
                </Field>
              </FieldGroup>
            </FieldSet>

          </FieldGroup>
        </form>
      </FormProvider>
    </DashboardPageLayout>
  );
}
