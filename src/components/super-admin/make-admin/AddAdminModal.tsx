"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { createAdmin } from "@/services/admin.service";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
};

export function AddAdminModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState(initialForm);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    try {
      const response = await createAdmin(form);
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Admin created successfully");
      setForm(initialForm);
      setIsOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to create admin",
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
      title="Add New Admin"
      description="Create an administrator account."
      actionTrigger={children}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="adminFirstName">First Name</FieldLabel>
              <Input
                id="adminFirstName"
                value={form.firstName}
                onChange={(event) =>
                  updateField("firstName", event.target.value)
                }
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="adminLastName">Last Name</FieldLabel>
              <Input
                id="adminLastName"
                value={form.lastName}
                onChange={(event) =>
                  updateField("lastName", event.target.value)
                }
                required
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="adminEmail">Email</FieldLabel>
            <Input
              id="adminEmail"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="adminPhone">Phone</FieldLabel>
            <Input
              id="adminPhone"
              type="tel"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="adminPassword">Password</FieldLabel>
            <Input
              id="adminPassword"
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              minLength={8}
              required
            />
          </Field>
        </FieldGroup>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Add Admin"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
