"use client";

import { ProfileCard } from "@/components/user/profile/ProfileCard";
import { ProfileLogoutButton } from "@/components/user/profile/ProfileLogoutButton";
import { ProfileSettings } from "@/components/user/profile/ProfileSettings";
import { useUserContext } from "@/providers/UserProvider";

export default function ProfilePage() {
  const { user } = useUserContext();

  // Show skeleton if user data is missing
  if (!user) {
    return (
      <div className="space-y-4 pt-16 sm:pt-4">
        <div className="w-full h-45 rounded-2xl bg-muted animate-pulse" />
        <div className="w-full h-30 rounded-xl bg-muted animate-pulse" />
        <div className="w-full h-12 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="-m-4 flex flex-1 animate-fadeIn flex-col pb-18">
      <div className="p-4">
        <ProfileCard user={user} isLoading={false} />
        <ProfileSettings />
        <ProfileLogoutButton />
      </div>
    </div>
  );
}
