"use client";

import { useEffect, useState } from "react";
import { ProfileCard } from "@/components/user/profile/ProfileCard";
import { ProfileLogoutButton } from "@/components/user/profile/ProfileLogoutButton";
import { ProfileSettings } from "@/components/user/profile/ProfileSettings";
import { ErrorToast } from "@/lib/utils";
import { getMyProfile } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth.store";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut);
  const [isLoading, setIsLoading] = useState(!user);

  useEffect(() => {
    if (user || isLoggingOut) return;

    const loadProfile = async () => {
      try {
        const response = await getMyProfile();
        if (response.success) setUser(response.data);
      } catch (error: unknown) {
        ErrorToast(
          error instanceof Error ? error.message : "Unable to load profile",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, [setUser, user, isLoggingOut]);

  return (
    <div className="-m-4 flex flex-1 animate-fadeIn flex-col pb-18">
      <div className="p-4">
        <ProfileCard user={user} isLoading={isLoading} />
        <ProfileSettings />
        <ProfileLogoutButton />
      </div>
    </div>
  );
}
