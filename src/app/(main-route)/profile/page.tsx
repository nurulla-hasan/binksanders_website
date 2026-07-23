"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Gavel,
  Headset,
  LogOut,
  Moon,
  Pencil,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorToast, getInitials, SuccessToast } from "@/lib/utils";
import { changePassword, logout } from "@/services/auth.service";
import { getMyProfile, updateProfile } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth.store";

const settingsLinks = [
  {
    id: "privacy",
    icon: Headset,
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    id: "terms",
    icon: Gavel,
    label: "Terms & Condition",
    href: "/terms-and-condition",
  },
];

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [mounted, setMounted] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(!user);

  useEffect(() => {
    const mountedTimer = window.setTimeout(() => setMounted(true), 0);

    if (user) return () => window.clearTimeout(mountedTimer);

    const loadProfile = async () => {
      try {
        const response = await getMyProfile();
        if (response.success) setUser(response.data);
      } catch (error: unknown) {
        ErrorToast(
          error instanceof Error ? error.message : "Unable to load profile",
        );
      } finally {
        setIsProfileLoading(false);
      }
    };

    void loadProfile();

    return () => window.clearTimeout(mountedTimer);
  }, [setUser, user]);

  const handleProfileUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const imageValue = formData.get("image");
    const image =
      imageValue instanceof File && imageValue.size > 0
        ? imageValue
        : undefined;

    if (!firstName) {
      ErrorToast("First name is required");
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateProfile({
        data: { firstName, lastName },
        image,
      });
      if (!response.success) throw new Error(response.message);

      const profileResponse = await getMyProfile();
      if (profileResponse.success) setUser(profileResponse.data);
      SuccessToast(response.message || "Profile updated successfully");
      setEditOpen(false);
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to update profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const oldPassword = String(formData.get("oldPassword") || "");
    const newPassword = String(formData.get("newPassword") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!oldPassword || !newPassword) {
      ErrorToast("Current and new password are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      ErrorToast("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await changePassword({ oldPassword, newPassword });
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "Password changed successfully");
      setPasswordOpen(false);
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to change password",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    clearAuth();
    await logout("/auth/login");
  };

  const displayName = user?.fullName || user?.firstName || "User";

  return (
    <div className="-m-4 flex flex-1 animate-fadeIn flex-col pb-18">
      <div className="p-4">
        {isProfileLoading ? (
          <ProfileCardSkeleton />
        ) : (
          <div className="mb-8 rounded-sm bg-secondary/90 p-5 shadow-sm">
            <div className="mb-4 flex gap-4">
              <Avatar className="mt-1 size-14">
                {user?.image && (
                  <AvatarImage src={user.image} alt={displayName} />
                )}
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-[17px] font-bold leading-tight text-foreground">
                  {displayName}
                </h2>
                <p className="mt-1 truncate text-[11px] font-medium text-foreground/80">
                  {user?.email || "Email not available"}
                </p>
                <p className="mt-1 text-[10px] capitalize tracking-wide text-foreground/60">
                  {user?.authType
                    ? `${user.authType} account`
                    : "Learning program"}
                </p>
              </div>
            </div>

            <div className="rounded-sm border border-border/50 bg-background/40 p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-medium text-foreground">
                  Program progress
                </span>
                <span className="text-[9px] font-bold text-foreground/80">
                  1/8
                </span>
              </div>
              <Progress value={12.5} className="h-1.5 bg-background/60" />
            </div>
          </div>
        )}

        <div className="flex-1 px-1">
          <h3 className="mb-4 font-heading text-[15px] font-bold tracking-tight text-foreground">
            Settings
          </h3>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex w-full items-center justify-between rounded-sm bg-muted p-3.5 transition-colors hover:bg-muted/60"
            >
              <div className="flex items-center gap-3">
                {mounted && theme === "dark" ? (
                  <Sun className="size-4 text-foreground/80" />
                ) : (
                  <Moon className="size-4 text-foreground/80" />
                )}
                <span className="text-[13px] font-medium text-foreground/90">
                  {mounted && theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
              </div>
            </button>

            <Drawer open={editOpen} onOpenChange={setEditOpen}>
              <DrawerTrigger asChild>
                <SettingsButton icon={Pencil} label="Edit Profile" />
              </DrawerTrigger>
              <DrawerContent>
                <form
                  onSubmit={handleProfileUpdate}
                  className="mx-auto w-full max-w-120"
                >
                  <DrawerHeader>
                    <DrawerTitle>Edit Profile</DrawerTitle>
                    <DrawerDescription>
                      Update your personal details below.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="space-y-4 p-4 pb-0">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          defaultValue={user?.firstName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          defaultValue={user?.lastName}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileImage">Profile Image</Label>
                      <Input
                        id="profileImage"
                        name="image"
                        type="file"
                        accept="image/*"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        type="email"
                        disabled
                      />
                    </div>
                  </div>
                  <DrawerFooter className="mt-4">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditOpen(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </DrawerFooter>
                </form>
              </DrawerContent>
            </Drawer>

            <Drawer open={passwordOpen} onOpenChange={setPasswordOpen}>
              <DrawerTrigger asChild>
                <SettingsButton
                  icon={ShieldCheck}
                  label="Change Password"
                />
              </DrawerTrigger>
              <DrawerContent>
                <form
                  onSubmit={handlePasswordChange}
                  className="mx-auto w-full max-w-120"
                >
                  <DrawerHeader>
                    <DrawerTitle>Change Password</DrawerTitle>
                    <DrawerDescription>
                      Secure your account with a new password.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="space-y-4 p-4 pb-0">
                    <PasswordField
                      id="oldPassword"
                      label="Current Password"
                    />
                    <PasswordField id="newPassword" label="New Password" />
                    <PasswordField
                      id="confirmPassword"
                      label="Confirm Password"
                    />
                  </div>
                  <DrawerFooter className="mt-4">
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? "Changing..." : "Change Password"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPasswordOpen(false)}
                      disabled={isChangingPassword}
                    >
                      Cancel
                    </Button>
                  </DrawerFooter>
                </form>
              </DrawerContent>
            </Drawer>

            {settingsLinks.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex w-full items-center justify-between rounded-sm bg-muted p-3.5 transition-colors hover:bg-muted/60"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="size-4 text-foreground/80" />
                  <span className="text-[13px] font-medium text-foreground/90">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/50" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 px-1">
          <Button
            onClick={handleLogOut}
            disabled={isLoggingOut}
            variant="outline"
            className="h-auto w-full gap-2 rounded-sm border-border/40 bg-muted p-3.5 text-[#E11D48] hover:bg-muted/70 hover:text-[#E11D48]"
          >
            <LogOut className="size-4" />
            <span className="text-[13px] font-medium">
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function SettingsButton({
  icon: Icon,
  label,
}: {
  icon: typeof Pencil;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-sm bg-muted p-3.5 transition-colors hover:bg-muted/60"
    >
      <div className="flex items-center gap-3">
        <Icon className="size-4 text-foreground/80" />
        <span className="text-[13px] font-medium text-foreground/90">
          {label}
        </span>
      </div>
      <ChevronRight className="size-4 text-muted-foreground/50" />
    </button>
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

function ProfileCardSkeleton() {
  return (
    <div className="mb-8 rounded-sm bg-secondary/90 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-4">
        <Skeleton className="size-14 shrink-0 rounded-full bg-background/55" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32 bg-background/55" />
          <Skeleton className="h-3 w-48 max-w-full bg-background/45" />
          <Skeleton className="h-2.5 w-24 bg-background/40" />
        </div>
      </div>
      <div className="space-y-3 rounded-sm border border-border/50 bg-background/40 p-3">
        <div className="flex justify-between gap-4">
          <Skeleton className="h-3 w-24 bg-background/60" />
          <Skeleton className="h-3 w-8 bg-background/60" />
        </div>
        <Skeleton className="h-1.5 w-full bg-background/60" />
      </div>
    </div>
  );
}
