"use client";

import { useState, type FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { changePassword } from "@/services/auth.service";

export function ChangePasswordModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    try {
      const response = await changePassword({ oldPassword, newPassword });
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setIsOpen(false);
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to change password");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ModalWrapper
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Change Password"
      description="Update your account password."
      actionTrigger={<Button variant="outline"><KeyRound /> Change Password</Button>}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
          <Field><FieldLabel>Current Password</FieldLabel><Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required /></Field>
          <Field><FieldLabel>New Password</FieldLabel><Input type="password" minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></Field>
        </FieldGroup>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Password"}</Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
