import type { ReactNode } from "react";
import { BottomNav } from "@/components/common/BottomNav";
import { TopNav } from "@/components/common/TopNav";

export default function MainRouteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen relative pb-20 w-full">
      <TopNav />
      {/* Main content area */}
      <main className="flex-1 flex flex-col w-full p-4">
        {children}
      </main>
      
      {/* Fixed bottom navigation */}
      <BottomNav />
    </div>
  );
}
