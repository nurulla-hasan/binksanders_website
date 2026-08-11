"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { TrainingAuthType } from "@/lib/types/training.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { authenticateTraining } from "@/services/training.service";

type JoinTrainingFormProps = {
  trainingId: string;
  authType?: string;
  inviteToken?: string;
};

const authLabels: Record<
  TrainingAuthType,
  { title: string; label: string; placeholder: string }
> = {
  passcode: {
    title: "Passcode Login",
    label: "Passcode",
    placeholder: "Enter passcode",
  },
  email: {
    title: "Email Login",
    label: "Email",
    placeholder: "name@example.com",
  },
  employeeId: {
    title: "Employee ID Login",
    label: "Employee ID",
    placeholder: "EMP001",
  },
  guest: {
    title: "Guest Login",
    label: "Name",
    placeholder: "Guest User",
  },
};

const isTrainingAuthType = (value?: string): value is TrainingAuthType => {
  return (
    value === "passcode" ||
    value === "email" ||
    value === "employeeId" ||
    value === "guest"
  );
};

export function JoinTrainingForm({
  trainingId,
  authType,
}: JoinTrainingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedAuthType = isTrainingAuthType(authType) ? authType : undefined;
  const copy = useMemo(
    () => (selectedAuthType ? authLabels[selectedAuthType] : undefined),
    [selectedAuthType],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAuthType) {
      ErrorToast("This training link has an invalid auth type");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const value = String(formData.get("credential") || "").trim();

    if (!value) {
      ErrorToast(`${copy?.label || "Credential"} is required`);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload =
        selectedAuthType === "guest"
          ? { authType: selectedAuthType, name: value }
          : { authType: selectedAuthType, identifier: value };

      const response = await authenticateTraining(trainingId, payload);

      if (!response.success) throw new Error(response.message);

      SuccessToast(response.message || "Training login successful");
      router.replace("/");
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to join training",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedAuthType || !copy) {
    return (
      <div className="space-y-3 text-center">
        <h1 className="font-heading text-2xl font-bold">
          Invalid Training Link
        </h1>
        <p className="text-sm text-muted-foreground">
          This link is missing a supported auth type.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-bold">{copy.title}</h1>
        <p className="text-sm text-muted-foreground">
          Enter your {copy.label.toLowerCase()} to join this training.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="training-credential">{copy.label}</FieldLabel>
        <Input
          id="training-credential"
          name="credential"
          type={selectedAuthType === "email" ? "email" : "text"}
          placeholder={copy.placeholder}
          autoComplete={selectedAuthType === "email" ? "email" : "off"}
        />
      </Field>

      <Button type="submit" size="lg-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <ArrowRight />
        )}
        {isSubmitting ? "Joining..." : "Join Training"}
      </Button>
    </form>
  );
}

