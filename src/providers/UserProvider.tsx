"use client";

import { createContext, useContext, ReactNode } from "react";
import type { CurrentUser } from "@/lib/types/user.type";

type UserContextType = {
  user: CurrentUser | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  user,
  children,
}: {
  user: CurrentUser | null;
  children: ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
