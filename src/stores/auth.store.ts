"use client";

import { create } from "zustand";
import type { CurrentUser } from "@/lib/types/user.type";

type AuthStore = {
  user: CurrentUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: CurrentUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  clearAuth: () =>
    set({ user: null, isLoading: false, isInitialized: false }),
}));
