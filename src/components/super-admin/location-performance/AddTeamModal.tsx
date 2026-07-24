"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CompanyDropdownItem } from "@/lib/types/company.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { createTeam } from "@/services/team.service";

const initialForm = { name: "", companyId: "", passcode: "" };

export function AddTeamModal({ companies }: { companies: CompanyDropdownItem[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState(initialForm);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    try {
      const response = await createTeam(form);
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Team created successfully");
      setForm(initialForm);
      setIsOpen(false);
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to create team");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ModalWrapper
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Add Team"
      description="Create a team and set its access passcode."
      actionTrigger={<Button><Plus /> Add Team</Button>}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel>Company</FieldLabel>
            <Select value={form.companyId} onValueChange={(value) => setForm({ ...form, companyId: value })} required>
              <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem
                    key={company._id}
                    value={company._id}
                  >
                    {company.firstName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="teamName">Team Name</FieldLabel>
            <Input id="teamName" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </Field>
          <Field>
            <FieldLabel htmlFor="teamPasscode">Passcode</FieldLabel>
            <Input id="teamPasscode" type="password" value={form.passcode} onChange={(event) => setForm({ ...form, passcode: event.target.value })} required />
          </Field>
        </FieldGroup>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Add Team"}</Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
