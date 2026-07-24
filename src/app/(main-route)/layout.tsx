import type { ReactNode } from "react";
import { TopNav } from "@/components/common/TopNav";
import { getMyProfile } from "@/services/user.service";
import { UserProvider } from "@/providers/UserProvider";

export default async function MainRouteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const profileResponse = await getMyProfile().catch(() => null);
  const user = profileResponse?.success ? profileResponse.data : null;

  return (
    <UserProvider user={user}>
      <div className="flex flex-col min-h-dvh relative w-full max-w-120 mx-auto">
        <TopNav />
        {/* Main content area */}
        <main className="flex-1 flex flex-col w-full p-4">
          {children}
        </main>
      </div>
    </UserProvider>
  );
}
