"use client";

import { type FormEvent, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { changePassword } from "@/services/auth.service";
import { SettingsButton } from "./SettingsButton";

export function ChangePasswordDrawer() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const oldPassword = String(formData.get("oldPassword") || "");
    const newPassword = String(formData.get("newPassword") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!oldPassword || !newPassword) {
      return ErrorToast("Current and new password are required");
    }
    if (newPassword !== confirmPassword) {
      return ErrorToast("New passwords do not match");
    }

    setIsPending(true);
    try {
      const response = await changePassword({ oldPassword, newPassword });
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Password changed successfully");
      setOpen(false);
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to change password",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <SettingsButton icon={ShieldCheck} label="Change Password" />
      </DrawerTrigger>
      <DrawerContent>
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-120">
          <DrawerHeader>
            <DrawerTitle>Change Password</DrawerTitle>
            <DrawerDescription>
              Secure your account with a new password.
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4 p-4 pb-0">
            <PasswordField id="oldPassword" label="Current Password" />
            <PasswordField id="newPassword" label="New Password" />
            <PasswordField id="confirmPassword" label="Confirm Password" />
          </div>
          <DrawerFooter className="mt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Changing..." : "Change Password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

function PasswordField({ id, label }: { id: string; label: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type="password" />
    </div>
  );
}
