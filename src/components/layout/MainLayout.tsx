"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { getMyProfile } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth.store";



const MainLayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hasStartedProfileLoad = useRef(false);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    if (isInitialized || hasStartedProfileLoad.current) return;

    hasStartedProfileLoad.current = true;
    setLoading(true);

    const loadProfile = async () => {
      try {
        const response = await getMyProfile();
        if (response.success) setUser(response.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    void loadProfile();
  }, [
    isInitialized,
    setInitialized,
    setLoading,
    setUser,
  ]);

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative lg:ml-70 h-dvh overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 mt-16">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
