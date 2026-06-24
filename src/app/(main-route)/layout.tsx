import type { ReactNode } from "react";
import { TopNav } from "@/components/common/TopNav";

export default function MainRouteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-dvh relative w-full max-w-120 mx-auto">
      <TopNav />
      {/* Main content area */}
      <main className="flex-1 flex flex-col w-full p-4">
        {children}
      </main>
    </div>
  );
}
