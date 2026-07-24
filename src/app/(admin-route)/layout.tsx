import MainLayout from "@/components/layout/MainLayout";
import { getMyProfile } from "@/services/user.service";
import { UserProvider } from "@/providers/UserProvider";

export default async function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profileResponse = await getMyProfile().catch(() => null);
  const user = profileResponse?.success ? profileResponse.data : null;

  return (
    <UserProvider user={user}>
      <MainLayout>{children}</MainLayout>
    </UserProvider>
  );
}
