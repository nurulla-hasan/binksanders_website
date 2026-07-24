"use client";

import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/custom/DashboardHeader";
import DashboardPageLayout from "@/components/ui/custom/DashboardPageLayout";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ErrorToast, getInitials, SuccessToast } from "@/lib/utils";
import {
  changeAdminPassword,
  updateAdminProfile,
} from "@/services/admin.service";
import { useUserContext } from "@/providers/UserProvider";

export default function ProfilePage() {
  const { user } = useUserContext();
  const [profileDraft, setProfileDraft] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
  }>({});
  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const firstName = profileDraft.firstName ?? user?.firstName ?? "";
  const lastName = profileDraft.lastName ?? user?.lastName ?? "";
  const phone = profileDraft.phone ?? user?.phone ?? "";

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (file?: File) => {
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleProfileUpdate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsUpdating(true);

    try {
      const response = await updateAdminProfile({
        data: { firstName, lastName, phone },
        image,
      });
      if (!response.success) throw new Error(response.message);

      setProfileDraft({});
      setImage(undefined);
      setImagePreview("");
      SuccessToast(response.message || "Profile updated successfully");
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      ErrorToast("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await changeAdminPassword({ oldPassword, newPassword });
      if (!response.success) throw new Error(response.message);

      SuccessToast(response.message || "Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <DashboardPageLayout>
        <DashboardHeader
          title="Admin Profile"
          description="Manage your personal information, profile image, and account security."
        />

        <div className="grid max-w-5xl gap-6">
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-8 flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center">
              <div className="relative w-fit">
                <Avatar size="xl">
                  {(imagePreview || user?.image) && (
                    <AvatarImage
                      src={imagePreview || user?.image}
                      alt={user?.fullName || "Admin"}
                    />
                  )}
                  <AvatarFallback>
                    {getInitials(user?.fullName || "Admin")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Camera className="size-4" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {user?.fullName || "Admin User"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {user?.role === "superAdmin" ? "Super Admin" : "Admin"}
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <FieldGroup>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(event) =>
                        setProfileDraft((current) => ({
                          ...current,
                          firstName: event.target.value,
                        }))
                      }
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(event) =>
                        setProfileDraft((current) => ({
                          ...current,
                          lastName: event.target.value,
                        }))
                      }
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" value={user?.email || ""} disabled />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setProfileDraft((current) => ({
                          ...current,
                          phone: event.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="profileImage">Profile Image</FieldLabel>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageChange(event.target.files?.[0])}
                  />
                </Field>
              </FieldGroup>

              <div className="flex justify-end">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">Change Password</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use a strong password that you do not use elsewhere.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="oldPassword">Current Password</FieldLabel>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(event) => setOldPassword(event.target.value)}
                    required
                  />
                </Field>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      minLength={8}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm New Password
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      minLength={8}
                      required
                    />
                  </Field>
                </div>
              </FieldGroup>

              <div className="flex justify-end">
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      </DashboardPageLayout>
    </div>
  );
}
