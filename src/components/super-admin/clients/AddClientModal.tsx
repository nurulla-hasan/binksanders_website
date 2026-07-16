"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { createCompany } from "@/services/company.service";

const initialForm = { name: "", email: "", address: "" };

export function AddClientModal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState(initialForm);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    try {
      const response = await createCompany(form);
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Client created successfully");
      setForm(initialForm);
      setIsOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to create client",
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && !isPending) setForm(initialForm);
  };

  return (
    <ModalWrapper
      open={isOpen}
      onOpenChange={handleOpenChange}
      title="Add Client"
      description="Create a new client company."
      actionTrigger={children}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="clientName">Company Name</FieldLabel>
            <Input
              id="clientName"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="clientEmail">Email</FieldLabel>
            <Input
              id="clientEmail"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="clientAddress">Address</FieldLabel>
            <Input
              id="clientAddress"
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
              required
            />
          </Field>
        </FieldGroup>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Add Client"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
