"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Training, TrainingAuthType } from "@/lib/types/training.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { createTraining } from "@/services/training.service";

const authTypes: TrainingAuthType[] = ["passcode", "email", "employeeId", "guest"];

export function TrainingCreateForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [authType, setAuthType] = useState<TrainingAuthType>("passcode");
  const [thumbnailPreview, setThumbnailPreview] = useState<string>();

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setThumbnailPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : undefined;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const passcode = String(formData.get("passcode") || "").trim();
    const thumbnail = formData.get("thumbnail");

    if (!title || !description) {
      ErrorToast("Title and description are required");
      return;
    }

    if (authType === "passcode" && !passcode) {
      ErrorToast("Passcode is required for passcode auth");
      return;
    }

    setIsPending(true);

    try {
      const response = await createTraining<Training>({
        data: {
          title,
          description,
          authType,
          ...(authType === "passcode" ? { passcode } : {}),
        },
        thumbnailImage:
          thumbnail instanceof File && thumbnail.size > 0 ? thumbnail : undefined,
      });

      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Training created successfully");
      router.replace(`/super-admin/training/${response.data._id}`);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to create training");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input id="title" name="title" placeholder="Customer Service Excellence" />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea id="description" name="description" placeholder="Short training summary" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Auth Type</FieldLabel>
            <Select value={authType} onValueChange={(value) => setAuthType(value as TrainingAuthType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {authTypes.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="passcode">Passcode</FieldLabel>
            <Input
              id="passcode"
              name="passcode"
              placeholder="12345"
              disabled={authType !== "passcode"}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="thumbnail">Thumbnail</FieldLabel>
          <Input
            id="thumbnail"
            name="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
          {thumbnailPreview && (
            <div className="mt-3 overflow-hidden rounded-md border bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailPreview}
                alt="Selected training thumbnail preview"
                className="h-44 w-full object-cover"
              />
            </div>
          )}
        </Field>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            <Save /> {isPending ? "Creating..." : "Create Training"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
