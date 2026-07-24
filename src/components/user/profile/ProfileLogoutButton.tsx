"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export function ProfileLogoutButton() {
  const [isPending, setIsPending] = useState(false);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setIsLoggingOut = useAuthStore((state) => state.setIsLoggingOut);

  const handleLogout = async () => {
    setIsPending(true);
    setIsLoggingOut(true);
    clearAuth();
    await logout("/auth/login");
  };

  return (
    <div className="mt-12 px-1">
      <Button
        onClick={handleLogout}
        disabled={isPending}
        variant="outline"
        className="h-auto w-full gap-2 rounded-sm border-border/40 bg-muted p-3.5 text-[#E11D48] hover:bg-muted/70 hover:text-[#E11D48]"
      >
        <LogOut className="size-4" />
        <span className="text-[13px] font-medium">
          {isPending ? "Logging out..." : "Log Out"}
        </span>
      </Button>
    </div>
  );
}
